import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getGroupById, getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import { PhoneCallIcon } from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const GroupChatPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const didConnect = useRef(false);
  const channelRef = useRef(null);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
    staleTime: 45 * 60 * 1000,
  });

  const { data: group } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => getGroupById(groupId),
    enabled: !!groupId,
  });

  useEffect(() => {
    if (!tokenData?.token || !authUser || !group?.streamChannelId) return;

    if (!STREAM_API_KEY) {
      toast.error("Stream API key is not configured.");
      setLoading(false);
      return;
    }

    let client;
    let cancelled = false;

    const init = async () => {
      try {
        client = StreamChat.getInstance(STREAM_API_KEY);

        if (!client.userID) {
          const streamImage = authUser.profilePic?.startsWith("data:")
            ? ""
            : authUser.profilePic || "";
          await client.connectUser(
            { id: authUser._id, name: authUser.fullName, image: streamImage },
            tokenData.token
          );
          didConnect.current = true;
        }

        if (cancelled) return;

        const ch = client.channel("messaging", group.streamChannelId);
        await ch.watch();

        if (cancelled) {
          ch.stopWatching().catch(() => {});
          return;
        }

        channelRef.current = ch;
        setChatClient(client);
        setChannel(ch);
      } catch (err) {
        if (cancelled) return;
        console.error("Group chat init error:", err);
        toast.error("Could not connect to group chat. Please refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
      if (channelRef.current) {
        channelRef.current.stopWatching().catch(() => {});
        channelRef.current = null;
      }
      if (didConnect.current && client) {
        client.disconnectUser().catch(() => {});
        didConnect.current = false;
      }
    };
  }, [tokenData, authUser, group]);

  const handleGroupCall = () => {
    if (!channelRef.current || !group) return;
    const callUrl = `${window.location.origin}/call/${group.streamChannelId}`;
    channelRef.current.sendMessage({
      text: `📞 Group call started — join here: ${callUrl}`,
    });
    toast.success("Call link sent to the group!");
    navigate(`/call/${group.streamChannelId}`);
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh] flex flex-col">
      {/* Group info bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-base-200 border-b border-base-300 shrink-0">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-primary flex items-center justify-center text-primary-content text-xs font-bold select-none">
            {group?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold">{group?.name}</span>
          <span className="text-xs text-base-content/50">
            · {group?.members?.length} members
          </span>
        </div>
        <button className="btn btn-secondary btn-sm gap-2" onClick={handleGroupCall}>
          <PhoneCallIcon className="size-4" />
          Group Call
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <div className="w-full h-full">
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
            </div>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default GroupChatPage;

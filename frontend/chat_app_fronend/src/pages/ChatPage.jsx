import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

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
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const didConnect = useRef(false);
  // Keep a ref to the active channel so the cleanup always closes the right one
  const channelRef = useRef(null);

  const { authUser } = useAuthUser();
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
    staleTime: 45 * 60 * 1000,
  });

  useEffect(() => {
    if (!tokenData?.token || !authUser) return;

    if (!STREAM_API_KEY) {
      toast.error("Stream API key is not configured. Contact the site administrator.");
      setLoading(false);
      return;
    }

    let client;
    let cancelled = false;

    const initChat = async () => {
      try {
        client = StreamChat.getInstance(STREAM_API_KEY);

        if (!client.userID) {
          // Stream enforces 5 KB on user data — never pass base64 images
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

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        if (cancelled) {
          currChannel.stopWatching().catch(() => {});
          return;
        }

        channelRef.current = currChannel;
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        if (cancelled) return;
        console.error("Chat init error:", error);
        const msg = error?.message || "";
        if (msg.includes("token") || msg.includes("auth") || msg.includes("401")) {
          toast.error("Authentication failed. Please log out and log back in.");
        } else if (msg.includes("network") || msg.includes("connection")) {
          toast.error("Network error. Check your connection and try again.");
        } else {
          toast.error("Could not connect to chat. Please refresh the page.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initChat();

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
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channelRef.current) {
      const callUrl = `${window.location.origin}/call/${channelRef.current.id}`;
      channelRef.current.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Video call link sent!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
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
  );
};

export default ChatPage;

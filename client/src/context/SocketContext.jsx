import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const currentUser = useSelector((state) => state.user);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const socketClient = io("https://threads-dv7o.onrender.com", {
      query: {
        userId: currentUser?._id,
      },
    });
    setSocket(socketClient);
    socketClient.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });
    return () => socket && socket.close();
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

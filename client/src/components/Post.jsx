import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../requests/postRequests";
import useCustomToast from "../hooks/useCustomToast";

const Post = ({ post }) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user);
  const toast = useCustomToast();
  const dispatch = useDispatch();

  const handleDeletePost = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this post ?")) return;
    try {
      await dispatch(deletePost(post._id)).unwrap();
      toast("Success", "Post Deleted!", "success");
    } catch (error) {
      toast("Error", error, "error");
    }
  };

  return (
    <Link to={`/${post.postedBy.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            name={post.postedBy.username}
            src={post.postedBy.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${post.postedBy.username}`);
            }}
          />
          <Box width={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} width={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size={"xs"}
                name={post.replies[2]?.userId.username}
                src={post.replies[0]?.userId.profilePic}
                position={"absolute"}
                top={"0px"}
                left={"15px"}
                p={"2px"}
              />
            )}
            {post.replies[1] && (
              <Avatar
                size={"xs"}
                name={post.replies[2]?.userId.username}
                src={post.replies[1]?.userId.profilePic}
                position={"absolute"}
                bottom={"0px"}
                right={"-5px"}
                p={"2px"}
              />
            )}
            {post.replies[2] && (
              <Avatar
                size={"xs"}
                name={post.replies[2]?.userId.username}
                src={post.replies[2]?.userId.profilePic}
                position={"absolute"}
                bottom={"0px"}
                left={"4px"}
                p={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"}>
            <Flex width={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${post.postedBy.username}`);
                }}
              >
                {post.postedBy.username}
              </Text>
              <Image src="/verified.png" width={4} height={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                textAlign={"right"}
                width={36}
                color={"gray.light"}
              >
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {currentUser?._id === post.postedBy._id && (
                <DeleteIcon size={20} onClick={handleDeletePost} />
              )}
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.img} width={"full"} />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;

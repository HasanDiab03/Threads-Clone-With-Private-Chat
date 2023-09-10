import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import { getPost } from "../requests/postRequests";
import useCustomToast from "../hooks/useCustomToast";
import { formatDistanceToNow } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../requests/postRequests";

const PostPage = () => {
  const { pid } = useParams();
  const { post } = useSelector((state) => state.post);
  const [loading, setLoading] = useState(true);
  const toast = useCustomToast();
  const currentUser = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchPost = async () => {
    try {
      await dispatch(getPost(pid)).unwrap();
    } catch (error) {
      toast("Error", error, "error");
    }
    setLoading(false);
  };

  const handleDeletePost = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this post ?")) return;
    try {
      await dispatch(deletePost(post._id)).unwrap();
      toast("Success", "Post Deleted!", "success");
    } catch (error) {
      toast("Error", error, "error");
    }
    navigate(`/${post.postedBy.username}`);
  };

  useEffect(() => {
    fetchPost();
  }, [pid]);

  if (loading) {
    return (
      <Center mt={20}>
        <Spinner size={"xl"} />
      </Center>
    );
  }

  if (!post) {
    return <h1 style={{ textAlign: "center" }}>Post doesn&apos;t exist.</h1>;
  }

  return (
    <>
      <Flex>
        <Flex width={"full"} alignItems={"center"} gap={3}>
          <Avatar
            src={post?.postedBy?.profilePic}
            size={"md"}
            name="mark"
            cursor={"pointer"}
            onClick={() => navigate(`/${post.postedBy.username}`)}
          />
          <Flex alignItems={"center"}>
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              cursor={"pointer"}
              onClick={() => navigate(`/${post.postedBy.username}`)}
            >
              {post?.postedBy?.username}
            </Text>
            <Image src="/verified.png" width={4} height={4} ml={4} />
          </Flex>
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
            <DeleteIcon
              size={20}
              onClick={handleDeletePost}
              cursor={"pointer"}
            />
          )}
        </Flex>
      </Flex>
      <Text my={3}>{post?.text}</Text>
      {post.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={post?.img} width={"full"} />
        </Box>
      )}
      <Flex my={3}>
        <Actions post={post} />
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply, and post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {post?.replies.map((reply) => (
        <Comment key={reply._id} reply={reply} />
      ))}
    </>
  );
};

export default PostPage;

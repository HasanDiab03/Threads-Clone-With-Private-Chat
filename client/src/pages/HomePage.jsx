import { Center, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useCustomToast from "../hooks/useCustomToast";
import { getFeedPosts } from "../requests/postRequests";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
const HomePage = () => {
  const { posts } = useSelector((state) => state.post);
  const [loading, setLoading] = useState(false);
  const toast = useCustomToast();
  const dispatch = useDispatch();
  

  const getPosts = async () => {
    setLoading(true);
    try {
      await dispatch(getFeedPosts()).unwrap();
    } catch (error) {
      toast("Error", error, "error");
    }
    setLoading(false);
  };
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <>
      {loading && (
        <Center mt={20}>
          <Spinner size={"xl"} />
        </Center>
      )}
      {!loading && posts.length === 0 && (
        <Center mt={20}>
          <h1>Follow Some Users To Get Feed Posts</h1>
        </Center>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default HomePage;

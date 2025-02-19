import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  TextField,
  MenuItem,
  IconButton,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import {
  GET_USERS,
  GET_POSTS,
  ADD_USER,
  ADD_POST,
  DELETE_USER,
  DELETE_POST,
  USER_SUBSCRIPTION,
  POST_SUBSCRIPTION,
} from "./graphqlOperations";
import MuiAlert from "@mui/material/Alert";

// Constants
const DRAWER_WIDTH = 240;

// Styled Components
const RootContainer = styled(Box)({
  display: "flex",
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
});

const Sidebar = styled(Drawer)({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  marginTop: 30,
  "& .MuiDrawer-paper": {
    width: DRAWER_WIDTH,
    backgroundColor: "#333",
    color: "white",
  },
  "& .MuiListItem-root": {
    "&:hover": {
      backgroundColor: 'rgba(255, 255, 255, 0.08)', // Hover color
      cursor: "pointer"
    },
    "&.selected": {
      backgroundColor: 'rgba(255, 255, 255, 0.16)', // Selected color
      color: 'white', // Keep text white for contrast
    },
  },
});

const MainContent = styled(Box)({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  padding: "20px",
  backgroundColor: "#f5f5f5",
  height: "100vh",
  overflowY: "auto",
});

const AppBarStyled = styled(AppBar)({
  zIndex: 1201,
  width: "100%",
});

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ModalContent = styled(Box)({
  backgroundColor: "white",
  padding: 20,
  borderRadius: 8,
  width: 400,
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  position: "relative",
});

const CloseButton = styled(IconButton)({
  position: "absolute",
  top: 10,
  right: 10,
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const App = () => {
  const { data: usersData, loading: usersLoading, error: usersError, subscribeToMore: subscribeToUsers } = useQuery(GET_USERS);
  const { data: postsData, loading: postsLoading, error: postsError, subscribeToMore: subscribeToPosts } = useQuery(GET_POSTS);

  const [addUser, { error: userAddError }] = useMutation(ADD_USER);
  const [addPost] = useMutation(ADD_POST);
  const [deleteUser] = useMutation(DELETE_USER);
  const [deletePost] = useMutation(DELETE_POST);

  const [activeTab, setActiveTab] = useState("users");
  const [modal, setModal] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [newPost, setNewPost] = useState({
    userId: "",
    title: "",
    content: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Subscription logic
  useEffect(() => {
    const unsubscribeUsers = subscribeToUsers({
      document: USER_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newUsers = subscriptionData.data.users;
        return Object.assign({}, prev, { users: newUsers });
      }
    });

    const unsubscribePosts = subscribeToPosts({
      document: POST_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newPosts = subscriptionData.data.posts;
        return Object.assign({}, prev, { posts: newPosts });
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribePosts();
    };
  }, [subscribeToUsers, subscribeToPosts]);

  const handleAddUser = async () => {
    try {
      await addUser({ variables: { name: newUser.name, email: newUser.email } });
      setNewUser({ name: "", email: "" });
      setSnackbarMessage("User added successfully");
      setSnackbarOpen(true);
      setModal(null);
    } catch (error) {
      setSnackbarMessage("Failed to add user");
      setSnackbarOpen(true);
    }
  };

  const handleAddPost = async () => {
    try {
      await addPost({
        variables: {
          user_id: newPost.userId,
          title: newPost.title,
          content: newPost.content,
        },
      });
      setNewPost({ userId: "", title: "", content: "" });
      setSnackbarMessage("Post added successfully");
      setSnackbarOpen(true);
      setModal(null);
    } catch (error) {
      setSnackbarMessage("Failed to add post");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser({ variables: { id } });
      setSnackbarMessage("User deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to delete user");
      setSnackbarOpen(true);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await deletePost({ variables: { id } });
      setSnackbarMessage("Post deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to delete post");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <RootContainer>
      {/* Top Navigation Bar */}
      <AppBarStyled position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User & Post Management
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button color="inherit" onClick={() => setModal("addUser")}>Add User</Button>
            <Button color="inherit" onClick={() => setModal("addPost")}>Add Post</Button>
          </Box>
        </Toolbar>
      </AppBarStyled>

      {/* Sidebar */}
      <Sidebar variant="permanent">
        <List style={{ marginTop: "64px" }}>
          <ListItem button onClick={() => setActiveTab("users")}>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button onClick={() => setActiveTab("posts")}>
            <ListItemText primary="Posts" />
          </ListItem>
        </List>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        <Toolbar /> {/* Push content down below AppBar */}
        <Typography variant="h5">
          {activeTab === "users" ? "Users" : "Posts"}
        </Typography>
        {activeTab === "users" && (
          <Box>
            {usersLoading ? (
              <p>Loading...</p>
            ) : usersError ? (
              <p>Error loading users</p>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                }}
              >
                {usersData.users.map((user) => (
                  <Card
                    key={user.id}
                    sx={{ backgroundColor: "white", padding: 2 }}
                  >
                    <CardContent>
                      <Typography variant="h6">{user.name}</Typography>
                      <Typography color="textSecondary">
                        {user.email}
                      </Typography>
                      <Button onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        )}
        {activeTab === "posts" && (
          <Box>
            {postsLoading ? (
              <p>Loading...</p>
            ) : postsError ? (
              <p>Error loading posts</p>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                }}
              >
                {postsData.posts.map((post) => (
                  <Card
                    key={post.id}
                    sx={{ backgroundColor: "white", padding: 2 }}
                  >
                    <CardContent>
                      <Typography variant="h6">{post.title}</Typography>
                      <Typography>{post.content}</Typography>
                      <Typography color="textSecondary">
                        <strong>Author:</strong> {post.user.name}
                      </Typography>
                      <Button onClick={() => handleDeletePost(post.id)}>Delete</Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        )}
        {/* Modal for Adding User */}
        <StyledModal open={modal === "addUser"} onClose={() => {
          if (!userAddError) setModal(null); // Only close if no error occurred while adding user
        }}>
          <ModalContent>
            <CloseButton onClick={() => {
              if (!userAddError) setModal(null);
            }}>
              <CloseIcon />
            </CloseButton>
            <Typography variant="h6">Add User</Typography>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <Button
              variant="contained"
              onClick={handleAddUser}
              sx={{ marginTop: 2 }}
            >
              Add
            </Button>
          </ModalContent>
        </StyledModal>
        {/* Modal for Adding Post */}
        <StyledModal open={modal === "addPost"} onClose={() => setModal(null)}>
          <ModalContent>
            <CloseButton onClick={() => setModal(null)}>
              <CloseIcon />
            </CloseButton>
            <Typography variant="h6">Add Post</Typography>
            <TextField
              fullWidth
              select
              label="User"
              margin="normal"
              value={newPost.userId}
              onChange={(e) =>
                setNewPost({ ...newPost, userId: e.target.value })
              }
            >
              {usersData?.users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Title"
              margin="normal"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Content"
              margin="normal"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
            />
            <Button
              variant="contained"
              onClick={handleAddPost}
              sx={{ marginTop: 2 }}
            >
              Add
            </Button>
          </ModalContent>
        </StyledModal>
      </MainContent>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes("Failed") ? "error" : "success"} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </RootContainer>
  );
};

export default App;
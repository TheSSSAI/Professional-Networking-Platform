"use client";

import React, { useState } from 'react';
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Link as MuiLink,
  Menu,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  ThumbUpAltOutlined as LikeIcon,
  ThumbUpAlt as LikedIcon,
  CommentOutlined as CommentIcon,
  ShareOutlined as ShareIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { Post } from '@/graphql/generated/graphql';
import { formatDistanceToNow } from 'date-fns';
import NextLink from 'next/link';
import Image from 'next/image';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
  onEdit?: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onEdit }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // This would come from a real hook, e.g. useFeed()
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.reactionsCount || 0);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
    // In a real app:
    // const { likePost } = useFeed();
    // likePost({ variables: { postId: post.id } });
  };
  
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(post.id);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (onEdit) {
        onEdit(post);
    }
    handleMenuClose();
  }

  // This would come from useAuth() hook
  const isAuthor = true; // Assuming for now the viewer is the author for menu options

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={
          <NextLink href={`/profile/${post.author.profile?.customUrlSlug}`} passHref>
            <Avatar src={post.author.profile?.profilePictureUrl || undefined} aria-label="recipe">
              {post.author.profile?.name?.[0]}
            </Avatar>
          </NextLink>
        }
        action={
          isAuthor && (
            <>
              <IconButton aria-label="settings" onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Delete</MenuItem>
              </Menu>
            </>
          )
        }
        title={
          <NextLink href={`/profile/${post.author.profile?.customUrlSlug}`} passHref legacyBehavior>
            <MuiLink underline="hover" color="inherit">
              {post.author.profile?.name}
            </MuiLink>
          </NextLink>
        }
        subheader={post.author.profile?.professionalHeadline}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
          {post.content}
        </Typography>
      </CardContent>
      
      {post.mediaUrls && post.mediaUrls.length > 0 && (
         <Grid container spacing={0.5} sx={{ p: 1 }}>
            {post.mediaUrls.map((url, index) => (
                <Grid item xs={post.mediaUrls && post.mediaUrls.length > 1 ? 6 : 12} key={index}>
                    <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                        <Image src={url} alt={`Post image ${index + 1}`} layout="fill" objectFit="cover" />
                    </Box>
                </Grid>
            ))}
        </Grid>
      )}

      {/* Placeholder for Link Preview */}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
        <Typography variant="body2" color="text.secondary">
            {likeCount > 0 ? `${likeCount} Likes` : ''}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {post.commentsCount > 0 ? `${post.commentsCount} Comments` : ''}
        </Typography>
      </Box>

      <CardActions disableSpacing sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Button startIcon={isLiked ? <LikedIcon color="primary" /> : <LikeIcon />} onClick={handleLike} sx={{ textTransform: 'none', color: isLiked ? 'primary.main' : 'text.secondary' }}>
          Like
        </Button>
        <Button startIcon={<CommentIcon />} sx={{ textTransform: 'none', color: 'text.secondary' }}>
          Comment
        </Button>
        <Button startIcon={<ShareIcon />} sx={{ textTransform: 'none', color: 'text.secondary', ml: 'auto' }}>
          Share
        </Button>
      </CardActions>
    </Card>
  );
};

export default React.memo(PostCard);
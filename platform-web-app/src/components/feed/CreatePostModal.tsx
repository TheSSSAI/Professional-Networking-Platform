"use client";

import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Avatar,
  Stack,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  Alert,
} from '@mui/material';
import { PhotoCamera, Link as LinkIcon, Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
// import { useFeed } from '@/app-services/feed/hooks/useFeed';
// import { useAuth } from '@/app-services/auth/hooks/useAuth';

const MAX_POST_LENGTH = 3000;
const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE_MB = 5;

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

interface PostFormData {
  content: string;
}

const urlRegex = /(https?:\/\/[^\s]+)/g;

const CreatePostModal: React.FC<CreatePostModalProps> = ({ open, onClose }) => {
  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<PostFormData>({
    defaultValues: { content: '' },
    mode: 'onChange'
  });
  
  // const { user } = useAuth();
  // const { createPost, loading, error, generateLinkPreview } = useFeed();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [linkPreview, setLinkPreview] = useState<any>(null); // Replace with actual LinkPreview type
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const contentValue = watch('content');
  const isSubmitDisabled = (!contentValue?.trim() && images.length === 0) || contentValue.length > MAX_POST_LENGTH || isUploading;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (event.target.files) {
      const files = Array.from(event.target.files);
      if (images.length + files.length > MAX_IMAGES) {
        setUploadError(`You can upload a maximum of ${MAX_IMAGES} images.`);
        return;
      }
      
      const newImages: File[] = [];
      const newPreviews: string[] = [];

      for (const file of files) {
        if (
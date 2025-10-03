import { useCallback } from 'react';
import { useQuery, useMutation, ApolloError } from '@apollo/client';
import {
  GetUserProfileQuery,
  useGetUserProfileQuery,
  useUpdateBasicProfileMutation,
  UpdateBasicProfileInput,
  useAddWorkExperienceMutation,
  AddWorkExperienceInput,
  useUpdateWorkExperienceMutation,
  UpdateWorkExperienceInput,
  useDeleteWorkExperienceMutation,
  useAddEducationMutation,
  AddEducationInput,
  useUpdateEducationMutation,
  UpdateEducationInput,
  useDeleteEducationMutation,
  useAddSkillMutation,
  useDeleteSkillMutation,
  useEndorseSkillMutation,
  useUpdateProfileVisibilityMutation,
  ProfileVisibility,
  useSetCustomUrlMutation
} from '@/graphql/generated/graphql';

interface UseProfileResult {
  profileData: GetUserProfileQuery['userBySlug'] | null | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  updateBasicProfile: (input: UpdateBasicProfileInput) => Promise<any>;
  addWorkExperience: (input: AddWorkExperienceInput) => Promise<any>;
  updateWorkExperience: (input: UpdateWorkExperienceInput) => Promise<any>;
  deleteWorkExperience: (id: string) => Promise<any>;
  addEducation: (input: AddEducationInput) => Promise<any>;
  updateEducation: (input: UpdateEducationInput) => Promise<any>;
  deleteEducation: (id: string) => Promise<any>;
  addSkill: (name: string) => Promise<any>;
  deleteSkill: (skillId: string) => Promise<any>;
  endorseSkill: (profileUserId: string, skillId: string) => Promise<any>;
  updateVisibility: (visibility: ProfileVisibility) => Promise<any>;
  setCustomUrl: (slug: string) => Promise<any>;
  refetchProfile: () => void;
}

export const useProfile = (slug: string): UseProfileResult => {
  const { data, loading, error, refetch } = useGetUserProfileQuery({
    variables: { slug },
    skip: !slug,
    fetchPolicy: 'cache-and-network',
  });

  const [updateBasicProfileMutation] = useUpdateBasicProfileMutation();
  const [addWorkExperienceMutation] = useAddWorkExperienceMutation();
  const [updateWorkExperienceMutation] = useUpdateWorkExperienceMutation();
  const [deleteWorkExperienceMutation] = useDeleteWorkExperienceMutation();
  const [addEducationMutation] = useAddEducationMutation();
  const [updateEducationMutation] = useUpdateEducationMutation();
  const [deleteEducationMutation] = useDeleteEducationMutation();
  const [addSkillMutation] = useAddSkillMutation();
  const [deleteSkillMutation] = useDeleteSkillMutation();
  const [endorseSkillMutation] = useEndorseSkillMutation();
  const [updateVisibilityMutation] = useUpdateProfileVisibilityMutation();
  const [setCustomUrlMutation] = useSetCustomUrlMutation();
  
  const refetchQueries = {
      refetchQueries: [{ query: useGetUserProfileQuery.document, variables: { slug } }],
      awaitRefetchQueries: true,
  };

  const updateBasicProfile = useCallback(async (input: UpdateBasicProfileInput) => {
    return updateBasicProfileMutation({ variables: { input }, ...refetchQueries });
  }, [updateBasicProfileMutation, slug]);

  const addWorkExperience = useCallback(async (input: AddWorkExperienceInput) => {
    return addWorkExperienceMutation({ variables: { input }, ...refetchQueries });
  }, [addWorkExperienceMutation, slug]);

  const updateWorkExperience = useCallback(async (input: UpdateWorkExperienceInput) => {
    return updateWorkExperienceMutation({ variables: { input }, ...refetchQueries });
  }, [updateWorkExperienceMutation, slug]);

  const deleteWorkExperience = useCallback(async (id: string) => {
    return deleteWorkExperienceMutation({ variables: { id }, ...refetchQueries });
  }, [deleteWorkExperienceMutation, slug]);
  
  const addEducation = useCallback(async (input: AddEducationInput) => {
    return addEducationMutation({ variables: { input }, ...refetchQueries });
  }, [addEducationMutation, slug]);

  const updateEducation = useCallback(async (input: UpdateEducationInput) => {
    return updateEducationMutation({ variables: { input }, ...refetchQueries });
  }, [updateEducationMutation, slug]);

  const deleteEducation = useCallback(async (id: string) => {
    return deleteEducationMutation({ variables: { id }, ...refetchQueries });
  }, [deleteEducationMutation, slug]);

  const addSkill = useCallback(async (name: string) => {
    return addSkillMutation({ variables: { name }, ...refetchQueries });
  }, [addSkillMutation, slug]);
  
  const deleteSkill = useCallback(async (skillId: string) => {
    return deleteSkillMutation({ variables: { skillId }, ...refetchQueries });
  }, [deleteSkillMutation, slug]);

  const endorseSkill = useCallback(async (profileUserId: string, skillId: string) => {
    return endorseSkillMutation({ variables: { profileUserId, skillId }, ...refetchQueries });
  }, [endorseSkillMutation, slug]);

  const updateVisibility = useCallback(async (visibility: ProfileVisibility) => {
    return updateVisibilityMutation({ variables: { visibility }, ...refetchQueries });
  }, [updateVisibilityMutation, slug]);

  const setCustomUrl = useCallback(async (slug: string) => {
    return setCustomUrlMutation({ variables: { slug }, ...refetchQueries });
  }, [setCustomUrlMutation, slug]);

  return {
    profileData: data?.userBySlug,
    loading,
    error,
    updateBasicProfile,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    deleteSkill,
    endorseSkill,
    updateVisibility,
    setCustomUrl,
    refetchProfile: refetch,
  };
};
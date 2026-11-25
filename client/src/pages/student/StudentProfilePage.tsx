import { useParams } from "react-router";
import { ProfileEditor } from "../../components/ProfileEditor";
import {
  useGetStudentProfile,
  useUpdateStudentProfile,
} from "../../hooks/use-students";
import type { Student } from "../../types/types";

export default function StudentProfilePage() {
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const { studentId = user.id ?? "" } = useParams();
  const profileQuery = useGetStudentProfile(studentId);
  const update = useUpdateStudentProfile(studentId);

  return (
    <ProfileEditor
      key={profileQuery.data?.id ?? "loading"}
      role="student"
      id={studentId}
      userEmail={user.email ?? "Student"}
      profile={profileQuery.data}
      isLoading={profileQuery.isLoading}
      isError={profileQuery.isError}
      refetch={profileQuery.refetch}
      isSaving={update.isPending}
      saveError={update.error instanceof Error ? update.error.message : ""}
      onSave={(data) => update.mutateAsync(data as Omit<Student, "password">)}
    />
  );
}

import { useParams } from "react-router";
import { ProfileEditor } from "../../components/ProfileEditor";
import {
  useGetAlumniProfile,
  useUpdateAlumniProfile,
} from "../../hooks/use-alumni";
import type { Alumni } from "../../types/types";

export default function AlumniProfilePage() {
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const { alumniId = user.id ?? "" } = useParams();
  const profileQuery = useGetAlumniProfile(alumniId);
  const update = useUpdateAlumniProfile(alumniId);

  return (
    <ProfileEditor
      key={profileQuery.data?.id ?? "loading"}
      role="alumni"
      id={alumniId}
      userEmail={user.email ?? "Alumni"}
      profile={profileQuery.data}
      isLoading={profileQuery.isLoading}
      isError={profileQuery.isError}
      refetch={profileQuery.refetch}
      isSaving={update.isPending}
      saveError={update.error instanceof Error ? update.error.message : ""}
      onSave={(data) => update.mutateAsync(data as Omit<Alumni, "password">)}
    />
  );
}

"use client";

import { Card, CardContent } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { EmptyState } from "@/components/molecules/empty-state";
import { EditUserDialog } from "@/components/organisms/iam/edit-user-dialog";
import { ViewUserDialog } from "@/components/organisms/iam/view-user-dialog";
import { Users, Shield, FileText } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";
import type { User } from "@/types";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  canManageUsers: boolean;
  onClearFilters?: () => void;
}

export function UserTable({ users, isLoading, canManageUsers, onClearFilters }: UserTableProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="p-0">
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t("iam.userDirectory")}
            </h3>
            <Badge variant="outline">{users.length} {t("navigation.iam").toLowerCase()}</Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              {t("iam.loadingUsers")}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      {t("common.name")}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {t("common.email")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3" />
                      {t("common.role")}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {t("iam.programs")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {t("common.status")}
                  </th>
                  {canManageUsers && (
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {t("common.actions")}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <UserRow key={user.id} user={user} canManageUsers={canManageUsers} />
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <EmptyState
                title={t("iam.noUsersFound")}
                message={t("iam.noUsersFoundDesc")}
                onClear={onClearFilters}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function UserRow({ user, canManageUsers }: { user: User; canManageUsers: boolean }) {
  const { t } = useTranslation();

  return (
    <tr className="transition-colors hover:bg-muted/30">
      <td className="px-4 py-3">
        <div className="font-semibold text-foreground">{user.name}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-muted-foreground">{user.email}</div>
      </td>
      <td className="px-4 py-3">
        <Badge
          variant={
            user.role === "Manager"
              ? "default"
              : user.role === "Staff"
              ? "secondary"
              : "outline"
          }
        >
          {user.role}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {user.assignedPrograms.slice(0, 2).map((programId) => (
            <Badge key={programId} variant="outline" className="text-xs">
              {programId}
            </Badge>
          ))}
          {user.assignedPrograms.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{user.assignedPrograms.length - 2}
            </Badge>
          )}
          {user.assignedPrograms.length === 0 && (
            <span className="text-xs text-muted-foreground">{t("common.noAssignments")}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <div
            className={`h-2 w-2 rounded-full ${
              user.status === "Active" ? "bg-green-500" : "bg-muted-foreground"
            }`}
          />
          <span className="text-sm font-medium">{user.status}</span>
        </div>
      </td>
      {canManageUsers && (
        <td className="px-4 py-3 text-right">
          <div className="flex justify-end gap-1">
            <ViewUserDialog user={user} variant="table" />
            <EditUserDialog user={user} canEdit={canManageUsers} variant="table" />
          </div>
        </td>
      )}
    </tr>
  );
}

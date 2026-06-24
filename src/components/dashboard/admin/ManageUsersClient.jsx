"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserCheck, UserX, Shield } from "lucide-react";
import { Button, Modal } from "@heroui/react";
import Image from "next/image";

export default function ManageUsersClient({ adminId }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state controllers
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToModify, setUserToModify] = useState(null); // Stores: { id, name, isBlocked }

    const fetchUsers = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/admin/users?userId=${adminId}`
            );
            if (!res.ok) throw new Error();
            const data = await res.json();
            setUsers(data.users || []);
        } catch (err) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [adminId]);

    // Step 1: Open modal and capture targeted user context
    const triggerToggleBlock = (userId, userName, currentStatus) => {
        setUserToModify({ id: userId, name: userName, isBlocked: currentStatus });
        setIsModalOpen(true);
    };

    // Step 2: Execute API request upon modal validation
    const handleConfirmToggleBlock = async () => {
        if (!userToModify) return;

        const { id, name, isBlocked } = userToModify;
        const newStatus = !isBlocked;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/admin/users/${id}/block?userId=${adminId}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isBlocked: newStatus }),
                }
            );

            if (res.ok) {
                toast.success(`User "${name}" ${newStatus ? "blocked" : "unblocked"} successfully`);
                setUsers((prev) =>
                    prev.map((u) =>
                        u._id === id ? { ...u, isBlocked: newStatus } : u
                    )
                );
            } else {
                toast.error("Failed to update user status");
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            // Clean up states and close UI modal cleanly
            setIsModalOpen(false);
            setUserToModify(null);
        }
    };

    if (loading) return <div className="py-12 text-center">Loading users...</div>;

    return (
        <>
            <div className="overflow-x-auto rounded-2xl border border-separator bg-surface">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-separator bg-background">
                            <th className="px-6 py-4 text-left">User</th>
                            <th className="px-6 py-4 text-left">Email</th>
                            <th className="px-6 py-4 text-left">Joined</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-separator">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-background/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full overflow-hidden border border-separator">
                                            {user.image ? (
                                                <Image width={40} height={40} src={user.image} alt={user.name} className="object-cover" />
                                            ) : (
                                                <div className="size-full bg-muted flex items-center justify-center text-lg">
                                                    {user.name?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            {user.role === "admin" && (
                                                <span className="text-xs text-accent font-medium flex items-center gap-1">
                                                    <Shield className="size-3" /> Admin
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-muted">{user.email}</td>
                                <td className="px-6 py-4 text-muted">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${user.isBlocked
                                                ? "bg-red-500/10 text-red-500"
                                                : "bg-success/10 text-success"
                                            }`}
                                    >
                                        {user.isBlocked ? (
                                            <>
                                                <UserX className="size-3" /> Blocked
                                            </>
                                        ) : (
                                            <>
                                                <UserCheck className="size-3" /> Active
                                            </>
                                        )}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Button
                                        variant={user.isBlocked ? "default" : "danger"}
                                        size="sm"
                                        onClick={() => triggerToggleBlock(user._id, user.name, user.isBlocked)}
                                    >
                                        {user.isBlocked ? "Unblock" : "Block"}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <Modal>
                <Modal.Backdrop 
                    isOpen={isModalOpen} 
                    onOpenChange={(open) => {
                        if (!open) {
                            setIsModalOpen(false);
                            setUserToModify(null);
                        }
                    }}
                    className="bg-black/40 backdrop-blur-sm"
                >
                    <Modal.Container>
                        <Modal.Dialog className="bg-surface text-foreground rounded-2xl max-w-md p-6 border border-separator shadow-xl relative">

                            <Modal.Header>
                                <Modal.Heading className="text-lg font-bold">
                                    {userToModify?.isBlocked ? "Unblock User" : "Block User"}
                                </Modal.Heading>
                            </Modal.Header>

                            <Modal.Body className="mt-2">
                                <p className="text-sm text-muted">
                                    Are you sure you want to{" "}
                                    <span className="font-semibold text-foreground text-lowercase">
                                        {userToModify?.isBlocked ? "Unblock" : "Block"}
                                    </span>{" "}
                                    <strong>{userToModify?.name}</strong>? This will modify their access privileges immediately.
                                </p>
                            </Modal.Body>

                            <Modal.Footer className="flex justify-end gap-2 mt-6">
                                <Button 
                                    className="rounded-xl px-4 py-2 text-sm font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-foreground"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setUserToModify(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors ${
                                        userToModify?.isBlocked 
                                            ? "bg-success hover:bg-success/90" 
                                            : "bg-danger hover:bg-danger/90"
                                    }`}
                                    onClick={handleConfirmToggleBlock}
                                >
                                    Confirm
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </>
    );
}
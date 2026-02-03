import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//--------------------------- Get all pending users ---------------------------
export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: {
        isApproved: false,
        resignedAt: null,
        role: "USER",
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        department: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    res.json(pendingUsers);
  } catch (err) {
    console.error("Error fetching pending users:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//--------------------------- Approve newly created users ---------------------------
export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isApproved: true },
    });

    res.json({ message: `Account for ${user.username} has been approved!` });
  } catch (err) {
    console.error("Error approving user:", err);
    res.status(500).json({ message: "Failed to approve user" });
  }
};

//--------------------------- Reject/delete newly created account for signup ---------------------------
export const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "Signup request rejected and removed." });
  } catch (err) {
    console.error("Error rejecting user:", err);
    res.status(500).json({ message: "Failed to reject user" });
  }
};

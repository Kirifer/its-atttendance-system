export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Fill out all missing fields" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const correct = await bcrypt.compare(oldPassword, user.password);
    if (!correct) {
      return res.status(400).json({ message: "Old password is incorrect!" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    res.json({ message: "Password has been updated successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error " });
  }
};

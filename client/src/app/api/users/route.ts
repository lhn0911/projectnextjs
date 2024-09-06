import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src", "database", "users.json");
    const data = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(data);
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: "Lỗi rồi ní ơi" });
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminRequest = await request.json();
    const filePath = path.join(process.cwd(), "src", "database", "users.json");
    const users = JSON.parse(fs.readFileSync(filePath, "utf8"));
    users.push(adminRequest);
    fs.writeFileSync(filePath, JSON.stringify(users), "utf8");
    return NextResponse.json({ message: "Thêm mới thành công nha ní" });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi rồi ní ơi" });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const filePath = path.join(process.cwd(), "src", "database", "users.json");
    let users = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const userIndex = users.findIndex((user: any) => user.id === id);
    
    if (userIndex === -1) {
      return NextResponse.json({ message: "Không tìm thấy người dùng" }, { status: 404 });
    }
    
    users.splice(userIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(users), "utf8");
    return NextResponse.json({ message: "Xóa thành công nha ní" });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi rồi ní ơi" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const updatedUser = await request.json();
    const filePath = path.join(process.cwd(), "src", "database", "users.json");
    let users = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const userIndex = users.findIndex((user: any) => user.id === updatedUser.id);
    
    if (userIndex === -1) {
      return NextResponse.json({ message: "Không tìm thấy người dùng" }, { status: 404 });
    }
    
    users[userIndex] = { ...users[userIndex], ...updatedUser };
    fs.writeFileSync(filePath, JSON.stringify(users), "utf8");
    return NextResponse.json({ message: "Cập nhật thành công nha ní" });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi rồi ní ơi" }, { status: 500 });
  }
}
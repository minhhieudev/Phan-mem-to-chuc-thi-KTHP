'use client';

import Loader from "@components/Loader";
import { PersonOutline } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Select, Input } from "antd";
import toast from "react-hot-toast"; // Đảm bảo bạn import toast

const { Option } = Select;
const { Search } = Input;

const Profile = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);
  const [khoaList, setKhoaList] = useState([]);

  const fetchKhoaData = async () => {
    try {
      const res = await fetch(`/api/admin/khoa`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setKhoaList(data);
      } else {
        toast.error("Failed to fetch khoa data");
      }
    } catch (err) {
      toast.error("An error occurred while fetching khoa data");
    }
  };

  useEffect(() => {
    fetchKhoaData();
  }, []);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    control,
    formState: { errors }, // Sửa 'error' thành 'errors'
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
        profileImage: user?.profileImage,
        khoa: user?.khoa,
      });
    }
    setLoading(false);
  }, [user, reset]);

  const uploadPhoto = (result) => {
    setValue("profileImage", result?.info?.secure_url);
  };

  const updateUser = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user._id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Cập nhật người dùng thất bại");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="profile-page bg-white w-[40%] max-sm:w-[80%] max-sm:text-[13px] rounded-md shadow-md mx-auto p-4">
      <h1 className="text-heading3-bold">CHỈNH SỬA THÔNG TIN</h1>

      <form className="edit-profile" onSubmit={handleSubmit(updateUser)}>
        <div className="input bg-white">
          <input
            {...register("username", {
              required: "Username is required",
              validate: (value) => {
                if (value.length < 3) {
                  return "Username must be at least 3 characters";
                }
              },
            })}
            type="text"
            placeholder="Username"
            className="input-field"
          />
          <PersonOutline sx={{ color: "#737373" }} />
        </div>
        {errors?.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}

        {/* Select Khoa */}
        <Controller
          name="khoa"
          control={control}
          rules={{ required: "Khoa là bắt buộc" }}
          render={({ field }) => (
            <Select className="w-full" placeholder="Chọn khoa" {...field}>
              {khoaList.length > 0 ? (
                khoaList.map(khoa => (
                  <Option key={khoa._id} value={khoa.tenKhoa}>
                    {khoa.tenKhoa}
                  </Option>
                ))
              ) : (
                <Option disabled>Không có khoa nào</Option>
              )}
            </Select>
          )}
        />
        {errors?.khoa && (
          <p className="text-red-500">{errors.khoa.message}</p>
        )}

        <div className="flex items-center justify-between">
          <img
            src={
              watch("profileImage") ||
              user?.profileImage ||
              "/assets/person.jpg"
            }
            alt="profile"
            className="w-40 h-40 rounded-full"
          />
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUpload={uploadPhoto}
            onError={(error) => {
              console.error('Upload error:', error);
              toast.error("Có lỗi xảy ra khi upload ảnh");
            }}
            uploadPreset="e0rggou2"
            onClick={() => {
            }}  // Thêm sự kiện onClick để kiểm tra nút được nhấn
          >
            <p className="text-body-bold ml-3">Upload new photo</p>
          </CldUploadButton>

        </div>

        <button className="btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;

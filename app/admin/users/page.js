"use client";
import { deleteUser, getUsers, updateUser } from "@/app/lib/fetch/Users";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getUsers();
        if (!data) throw new Error(" مشکل در دریافت اطلاعات کاربران");
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      setError("مشکلی در حذف پیش آمد");
    }
  };

  // Handle active/deactive user
  const handleActive = async (id, preStatus) => {
    setLoading(true);
    const newStatus = !Boolean(preStatus);
    try {
      const response = await updateUser(id, newStatus);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user._id === id) {
          return { ...user, isActive: newStatus };
        }
        return user;
      })
    );
  };

  // Handle admin user
  const handleAdmin = async (id, preStatus) => {
    setLoading(true);
    const newStatus = !Boolean(preStatus);
    try {
      const response = await fetch(`/api/auth?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: newStatus }),
      });
      if (response.status === 400) {
        let message = await response.json();
        setError(message.message);
      }
      if (!response.ok) throw new Error("مشکلی در تغییر وضعیت کاربر آمده است");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user._id === id) {
          return { ...user, isAdmin: newStatus };
        }
        return user;
      })
    );
  };

  return (
    <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
      <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
        <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl"> مدیریت کاربران </h1>
        <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">در این قسمت کاربران را مدیریت کنید</span>
        <Image
          className="absolute object-fill w-full h-full left-0 top-0 right-0 bottom-0 header-img"
          src={"/uploads/top-header.png"}
          alt="هدر"
          width={1663}
          height={277}
        />
      </div>
      <div className="container py-4 px-10 -mt-10 z-30 relative">
        <div className="bg-white py-4 px-4 rounded-lg shadow-xl shadow-[#112692]/5 dark:bg-shop-dark">
          {error && <div className="text-red-500 text-center">{error}</div>}
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  {loading ? (
                    <table className="min-w-full text-center text-sm font-light text-surface dark:text-white">
                      <thead className="border-b border-neutral-200 bg-neutral-50 dark:bg-gray-600 dark:border-gray-800 font-medium dark:text-neutral-200">
                        <tr>
                          <th scope="col" className=" px-6 py-4">
                            #
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            نام کاربر
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            موبایل
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            ایمیل
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            عملیات
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users &&
                          users.map((_, index) => (
                            <tr key={index} className="border-b border-neutral-200 dark:border-white/10">
                              <td className="whitespace-nowrap px-4 py-4 font-medium">
                                <div className="w-10 h-4 bg-gray-300 animate-pulse"></div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4">
                                <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4">
                                <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4">
                                <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4">
                                <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="min-w-full text-center text-sm font-light text-surface dark:text-white">
                      <thead className="border-b border-neutral-200 bg-neutral-50 dark:bg-gray-600 dark:border-gray-800 font-medium dark:text-neutral-200">
                        <tr>
                          <th scope="col" className=" px-6 py-4">
                            #
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            نام کاربر
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            موبایل
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            ایمیل
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            عملیات
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users &&
                          users.map((user, index) => {
                            return (
                              <tr key={index} className="border-b border-neutral-200 dark:border-white/10">
                                <td className="whitespace-nowrap  px-6 py-4 font-medium">{index + 1}</td>
                                <td className="whitespace-nowrap  px-6 py-4">{user.name || "not available"}</td>
                                <td className="whitespace-nowrap  px-6 py-4">{user.phone || "not available"}</td>
                                <td className="whitespace-nowrap  px-6 py-4">{user.email}</td>
                                <td className="whitespace-nowrap  px-6 py-4">
                                  <div className="flex justify-center gap-x-2">
                                    <button onClick={() => handleDelete(user._id)}>
                                      <svg fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                        <path
                                          d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path d="M20.708 6.23975H3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path
                                          d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </button>
                                    <button onClick={() => handleActive(user._id, user.isActive)}>
                                      {user.isActive ? (
                                        <svg
                                          className="w-6 h-6 text-gray-800 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          fill="none"
                                          viewBox="0 0 24 24">
                                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
                                        </svg>
                                      ) : (
                                        <svg
                                          className="w-6 h-6 text-gray-800 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          fill="none"
                                          viewBox="0 0 24 24">
                                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                                        </svg>
                                      )}
                                    </button>
                                    <button onClick={() => handleAdmin(user._id, user.isAdmin)}>
                                      {user.isAdmin ? (
                                        <svg
                                          className="w-6 h-6 text-gray-800 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          fill="none"
                                          viewBox="0 0 24 24">
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m8.032 12 1.984 1.984 4.96-4.96m4.55 5.272.893-.893a1.984 1.984 0 0 0 0-2.806l-.893-.893a1.984 1.984 0 0 1-.581-1.403V7.04a1.984
                                        1.984 0 0 0-1.984-1.984h-1.262a1.983 1.983 0 0 1-1.403-.581l-.893-.893a1.984 1.984 0 0 0-2.806 0l-.893.893a1.984 1.984 0 0 1-1.403.581H7.04A1.984 1.984 0 0 0 5.055 7.04v1.262c0 .527-.209 1.031-.581 1.403l-.893.893a1.984
                                        1.984 0 0 0 0 2.806l.893.893c.372.372.581.876.581 1.403v1.262a1.984 1.984 0 0 0 1.984 1.984h1.262c.527 0 1.031.209 1.403.581l.893.893a1.984 1.984 0 0 0 2.806 0l.893-.893a1.985 1.985 0 0 1 1.403-.581h1.262a1.984 1.984 0 0 0
                                        1.984-1.984V15.7c0-.527.209-1.031.581-1.403Z"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          className="w-6 h-6 text-gray-800 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          fill="none"
                                          viewBox="0 0 24 24">
                                          <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const Register = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    console.log(state);
  };

  return (
    <div className="min-w-screen min-h-screen bg-[#cdcae9] flex justify-center items-center">
      <div className="w-[350px] text-[#ffffff] p-2  ">
        <div className="bg-[#6f68d1] p-4 rounded-md ">
          <h2 className="text-xl mb-3 font-bold ">Chào mừng đến BlueMoon </h2>
          <p className="text-sm mb-3 font-medium">Vui lòng đăng ký</p>

          <form onSubmit={submit}>
            <div className="flex flex-col w-full gap-1 mb-3">
              <label htmlFor="name">Tên</label>
              <input
                onChange={inputHandle}
                value={state.name}
                className="px-3 py-2 outline-none border border-solid border-slate-400 bg-transparent rounded-md "
                type="text"
                name="name"
                placeholder="Name"
                id="name"
                required
              />
            </div>
            <div className="flex flex-col w-full gap-1 mb-3">
              <label htmlFor="email">Email</label>
              <input
                onChange={inputHandle}
                value={state.email}
                className="px-3 py-2 outline-none border border-solid border-slate-400 bg-transparent rounded-md "
                type="email"
                name="email"
                placeholder="Email"
                id="email"
                required
              />
            </div>

            <div className="flex flex-col w-full gap-1 mb-3">
              <label htmlFor="password">Mật khẩu</label>
              <input
                onChange={inputHandle}
                value={state.password}
                className="px-3 py-2 outline-none border border-solid border-slate-400 bg-transparent rounded-md "
                type="password"
                name="password"
                placeholder="Password"
                id="password"
                required
              />
            </div>

            <div className="flex items-center w-full gap-3 mb-3">
              <input
                className="w-4 h-4 text-blue-600 overflow-hidden bg-gray-200 rounded border-gray-300 focus:ring-blue-500"
                type="checkbox"
                name="checkbox"
                id="checkbox"
              />
              <label htmlFor="checkbox">
                Tôi đồng ý với chính sách bảo mật & điều khoản
              </label>
            </div>

            <button className="bg-slate-800 w-full hover:shadow-blue-300/50 hover:shadow-lg text-[#ffffff] rounded-md px-7 py-2 mb-3 ">
              Đăng ký
            </button>

            <div className="flex items-center mb-3 gap-3 justify-center">
              <p>
                Bạn đã có tài khoản ?
                <Link className="font-bold" to="/login">
                  Vui lòng đăng nhập
                </Link>
              </p>
            </div>

            <div className="w-full flex justify-center items-center mb-3 ">
              <div className="w-[45%] bg-slate-700 h-[1px] "></div>
              <div className="w-[10%] flex justify-center items-center">
                <span className="pb-1">Or</span>
              </div>
              <div className="w-[45%] bg-slate-700 h-[1px] "></div>
            </div>

            <div className="flex justify-center items-center gap-3">
              <div className="w-[135px] h-[35px] flex rounded-md bg-orange-700 shadow-lg hover:shadow-orange-700/50 justify-center cursor-pointer items-center overflow-hidden">
                <span>
                  <FaGoogle />
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

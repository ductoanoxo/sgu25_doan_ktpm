import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Profile.css'
import avt from './avt.jpg'
import User from '../API/User';
import { addSession } from '../Redux/Action/ActionSession';
import { useDispatch } from 'react-redux';

Profile.propTypes = {};

function Profile(props) {

    // Trạng thái tab (chỉnh sửa thông tin hoặc đổi mật khẩu)
    const [edit_status, set_edit_status] = useState('edit_profile')
    const handler_Status = (value) => set_edit_status(value)

    // Thông tin user
    const [user, set_user] = useState({})
    const [name, set_name] = useState('')
    const [username, set_username] = useState('')
    const [email, set_email] = useState('')

    // Mật khẩu
    const [password, set_password] = useState('')
    const [new_password, set_new_password] = useState('')
    const [compare_password, set_compare_password] = useState('')

    // Thông báo hiển thị cho người dùng
    const [message, set_message] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            const response = await User.Get_User(sessionStorage.getItem('id_user'))
            set_user(response)
            set_name(response.fullname)
            set_username(response.username)
            set_email(response.email)
        }
        fetchData()
    }, [])

    // Cập nhật thông tin hoặc đổi mật khẩu
    const handler_update = async () => {

        if (edit_status === 'edit_profile') {
            // Cập nhật thông tin người dùng
            const data = {
                _id: sessionStorage.getItem('id_user'),
                fullname: name,
                username: username
            }

            try {
                await User.Put_User(data)
                set_message('✅ Cập nhật thông tin thành công!')
            } catch (error) {
                set_message('❌ Lỗi khi cập nhật thông tin.')
            }

        } else if (edit_status === 'change_password') {
            // Đổi mật khẩu
            if (!password || !new_password || !compare_password) {
                set_message('⚠️ Vui lòng nhập đầy đủ các trường.')
                return
            }
            if (new_password !== compare_password) {
                set_message('⚠️ Mật khẩu xác nhận không khớp!')
                return
            }
            if (password === new_password) {
                set_message('⚠️ Mật khẩu mới không được trùng mật khẩu cũ!')
                return
            }

            try {
                const data = {
                    _id: sessionStorage.getItem('id_user'),
                    old_password: password,
                    new_password: new_password
                }

                const res = await User.ChangePassword(data)
                if (res.success) {
                    set_message('✅ Đổi mật khẩu thành công!')
                    set_password('')
                    set_new_password('')
                    set_compare_password('')
                } else {
                    set_message(res.message || '❌ Mật khẩu cũ không đúng!')
                }
            } catch (error) {
                set_message('❌ Lỗi khi đổi mật khẩu!')
            }
        }
    }

    return (
        <div className="container mt-5 pt-4" style={{ paddingBottom: '4rem' }}>
            <div className="group_profile">
                <div className="group_setting mt-3">
                    <div className="setting_left">
                        <div className={edit_status === 'edit_profile' ? 'setting_item setting_item_active' : 'setting_item'}
                            onClick={() => handler_Status('edit_profile')}>
                            <a className={edit_status === 'edit_profile' ? 'a_setting_active' : ''} style={{ fontSize: '1.1rem' }}>
                                Edit Profile
                            </a>
                        </div>

                        <div className={edit_status === 'change_password' ? 'setting_item setting_item_active' : 'setting_item'}
                            onClick={() => handler_Status('change_password')}>
                            <a className={edit_status === 'change_password' ? 'a_setting_active' : ''} style={{ fontSize: '1.1rem' }}>
                                Change Password
                            </a>
                        </div>
                    </div>

                    <div className="setting_right">

                        {/* Hiển thị thông báo */}
                        {message && (
                            <div className="alert alert-info text-center mt-3 mb-2" role="alert">
                                {message}
                            </div>
                        )}

                        {
                            edit_status === 'edit_profile' ? (
                                <div className="setting_edit_profile">

                                    <div className="txt_setting_edit pt-3 pb-2">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span style={{ fontWeight: '600' }}>Name</span>
                                        </div>
                                        <div>
                                            <input className="txt_input_edit" type="text" value={name}
                                                onChange={(e) => set_name(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="txt_setting_edit pt-3 pb-2">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span style={{ fontWeight: '600' }}>Username</span>
                                        </div>
                                        <div>
                                            <input className="txt_input_edit" type="text" value={username}
                                                onChange={(e) => set_username(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="txt_setting_edit pt-3 pb-2">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span style={{ fontWeight: '600' }}>Email</span>
                                        </div>
                                        <div>
                                            <input className="txt_input_edit" type="text" disabled={true} value={email}
                                                onChange={(e) => set_email(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-center pt-3 pb-4">
                                        <button className="btn btn-secondary" onClick={handler_update}>Submit</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="setting_change_password">
                                    <div className="txt_setting_edit pt-3 pb-2">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span style={{ fontWeight: '600' }}>Old Password</span>
                                        </div>
                                        <div>
                                            <input className="txt_input_edit" type="password" value={password}
                                                onChange={(e) => set_password(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="txt_setting_edit pt-3 pb-2">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span style={{ fontWeight: '600' }}>New Password</span>
                                        </div>
                                        <div>
                                            <input className="txt_input_edit" type="password" value={new_password}
                                                onChange={(e) => set_new_password(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="txt_setting_edit pt-3 pb-2">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span style={{ fontWeight: '600' }}>Confirm New Password</span>
                                        </div>
                                        <div>
                                            <input className="txt_input_edit" type="password" value={compare_password}
                                                onChange={(e) => set_compare_password(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-center pt-3 pb-4 align-items-center">
                                        <button className="btn btn-secondary" onClick={handler_update}>Change Password</button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;

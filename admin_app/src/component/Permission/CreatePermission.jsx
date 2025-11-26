import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import queryString from 'query-string'
import isEmpty from 'validator/lib/isEmpty'
import permissionAPI from '../Api/permissionAPI'

function CreatePermission(props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState('10');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isStaff, setIsStaff] = useState(false);
    const [isCustomer, setIsCustomer] = useState(false);
    const [validationMsg, setValidationMsg] = useState('');
    const { handleSubmit } = useForm();

    const validateAll = () => {
        let msg = {}
        if (isEmpty(name)) {
            msg.name = "Tên không được để trống"
        } else if (name.trim().length < 3) {
            msg.name = "Tên quyền phải có ít nhất 3 ký tự"
        }

        // Check if at least one role is selected (optional validation)
        // if (!isAdmin && !isStaff && !isCustomer) {
        //     msg.role = "Vui lòng chọn ít nhất một loại quyền"
        // }

        setValidationMsg(msg)
        if (Object.keys(msg).length > 0) return false;
        return true;
    }

    const handleCreate = () => {
        const isValid = validateAll();
        if (!isValid) return
        addPermission();
    }

    const addPermission = async () => {
        const query = '?' + queryString.stringify({ 
            name: name,
            description: description,
            level: level,
            isAdmin: isAdmin,
            isStaff: isStaff,
            isCustomer: isCustomer
        })
        const response = await permissionAPI.create(query)
        if (response.msg === "Bạn đã thêm thành công") {
            setName('');
            setDescription('');
            setLevel('10');
            setIsAdmin(false);
            setIsStaff(false);
            setIsCustomer(false);
        }
        setValidationMsg({ api: response.msg })
    }

    return (
        <div className="page-wrapper">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">
                                    <i className="fas fa-plus-circle mr-2"></i>
                                    Tạo quyền mới
                                </h4>
                                
                                {
                                    validationMsg.api === "Bạn đã thêm thành công" ?
                                        (
                                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                                <i className="fas fa-check-circle mr-2"></i>
                                                {validationMsg.api}
                                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </div>
                                        ) :
                                        (
                                            <p className="form-text text-danger">{validationMsg.api}</p>
                                        )
                                }

                                <form onSubmit={handleSubmit(handleCreate)}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="name">
                                                    <i className="fas fa-tag mr-2"></i>
                                                    Tên quyền <span className="text-danger">*</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="name" 
                                                    name="name" 
                                                    value={name} 
                                                    onChange={(e) => setName(e.target.value)} 
                                                    placeholder="Ví dụ: Manager, Editor, Viewer..."
                                                    required 
                                                />
                                                <p className="form-text text-danger">{validationMsg.name}</p>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="description">
                                                    <i className="fas fa-align-left mr-2"></i>
                                                    Mô tả
                                                </label>
                                                <textarea 
                                                    className="form-control" 
                                                    id="description" 
                                                    name="description" 
                                                    value={description} 
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    placeholder="Mô tả chi tiết về quyền này..."
                                                    rows="3"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="level">
                                                    <i className="fas fa-layer-group mr-2"></i>
                                                    Cấp độ quyền
                                                </label>
                                                <select 
                                                    className="form-control" 
                                                    id="level" 
                                                    name="level" 
                                                    value={level} 
                                                    onChange={(e) => setLevel(e.target.value)}
                                                >
                                                    <option value="10">10 - Thấp (Customer)</option>
                                                    <option value="50">50 - Trung bình (Staff)</option>
                                                    <option value="100">100 - Cao nhất (Admin)</option>
                                                </select>
                                                <small className="form-text text-muted">
                                                    Cấp độ càng cao, quyền hạn càng lớn
                                                </small>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>
                                                    <i className="fas fa-user-tag mr-2"></i>
                                                    Loại quyền
                                                </label>
                                                <div className="custom-control custom-checkbox mb-2">
                                                    <input 
                                                        type="checkbox" 
                                                        className="custom-control-input" 
                                                        id="isAdmin" 
                                                        checked={isAdmin}
                                                        onChange={(e) => {
                                                            setIsAdmin(e.target.checked)
                                                            if (e.target.checked) {
                                                                setLevel('100')
                                                                setIsStaff(false)
                                                                setIsCustomer(false)
                                                            }
                                                        }}
                                                    />
                                                    <label className="custom-control-label" htmlFor="isAdmin">
                                                        <span className="badge badge-danger">Admin</span>
                                                        <span className="ml-2">- Quản trị viên cao nhất</span>
                                                    </label>
                                                </div>

                                                <div className="custom-control custom-checkbox mb-2">
                                                    <input 
                                                        type="checkbox" 
                                                        className="custom-control-input" 
                                                        id="isStaff" 
                                                        checked={isStaff}
                                                        onChange={(e) => {
                                                            setIsStaff(e.target.checked)
                                                            if (e.target.checked) {
                                                                setLevel('50')
                                                                setIsAdmin(false)
                                                                setIsCustomer(false)
                                                            }
                                                        }}
                                                    />
                                                    <label className="custom-control-label" htmlFor="isStaff">
                                                        <span className="badge badge-warning">Nhân viên</span>
                                                        <span className="ml-2">- Nhân viên quản lý</span>
                                                    </label>
                                                </div>

                                                <div className="custom-control custom-checkbox mb-2">
                                                    <input 
                                                        type="checkbox" 
                                                        className="custom-control-input" 
                                                        id="isCustomer" 
                                                        checked={isCustomer}
                                                        onChange={(e) => {
                                                            setIsCustomer(e.target.checked)
                                                            if (e.target.checked) {
                                                                setLevel('10')
                                                                setIsAdmin(false)
                                                                setIsStaff(false)
                                                            }
                                                        }}
                                                    />
                                                    <label className="custom-control-label" htmlFor="isCustomer">
                                                        <span className="badge badge-info">Khách hàng</span>
                                                        <span className="ml-2">- Người dùng thông thường</span>
                                                    </label>
                                                </div>

                                                <p className="form-text text-danger">{validationMsg.role}</p>
                                            </div>

                                            <div className="alert alert-info">
                                                <i className="fas fa-info-circle mr-2"></i>
                                                <strong>Lưu ý:</strong>
                                                <ul className="mb-0 mt-2">
                                                    <li>Cấp độ Admin (100) có toàn quyền</li>
                                                    <li>Nhân viên (50) có quyền quản lý hạn chế</li>
                                                    <li>Khách hàng (10) chỉ có quyền cơ bản</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary">
                                        <i className="fas fa-save mr-2"></i>
                                        Tạo quyền
                                    </button>
                                    <a href="/permission" className="btn btn-secondary ml-2">
                                        <i className="fas fa-times mr-2"></i>
                                        Hủy
                                    </a>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer text-center text-muted">
                All Rights Reserved by Adminmart. Designed and Developed by <a href="https://wrappixel.com">WrapPixel</a>.
    </footer>
        </div>
    );
}

export default CreatePermission;
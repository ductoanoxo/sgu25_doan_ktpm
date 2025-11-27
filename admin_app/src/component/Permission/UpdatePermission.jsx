import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import queryString from 'query-string'
import isEmpty from 'validator/lib/isEmpty'
import permissionAPI from '../Api/permissionAPI'

function UpdatePermission(props) {
    const [id] = useState(props.match.params.id)
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState('10');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isStaff, setIsStaff] = useState(false);
    const [isCustomer, setIsCustomer] = useState(false);
    const [isSystem, setIsSystem] = useState(false);
    const [userCount, setUserCount] = useState(0);
    const [validationMsg, setValidationMsg] = useState('');
    const { handleSubmit } = useForm();

    useEffect(() => {
        const fetchAllData = async () => {
            const ct = await permissionAPI.details(id)
            console.log(ct)
            setName(ct.permission);
            setDescription(ct.description || '');
            setLevel(ct.level?.toString() || '10');
            setIsAdmin(ct.isAdmin || false);
            setIsStaff(ct.isStaff || false);
            setIsCustomer(ct.isCustomer || false);
            setIsSystem(ct.isSystem || false);
            setUserCount(ct.userCount || 0);
        }

        fetchAllData()
    }, [id])

    const validateAll = () => {
        let msg = {}
        if (isEmpty(name)) {
            msg.name = "Tên không được để trống"
        } else if (name.trim().length < 3) {
            msg.name = "Tên quyền phải có ít nhất 3 ký tự"
        }

        setValidationMsg(msg)
        if (Object.keys(msg).length > 0) return false;
        return true;
    }

    const handleUpdate = () => {
        const isValid = validateAll();
        if (!isValid) return

        // Warning if changing permission with users
        if (userCount > 0) {
            const confirmed = window.confirm(
                `CẢNH BÁO: Có ${userCount} người dùng đang sử dụng quyền này.\n\n` +
                `Thay đổi cấp độ hoặc loại quyền có thể ảnh hưởng đến quyền truy cập của họ.\n\n` +
                `Bạn có chắc chắn muốn cập nhật?`
            );
            if (!confirmed) return;
        }

        updatePermission();
    }

    const updatePermission = async () => {
        const query = '?' + queryString.stringify({ 
            id: id, 
            name: name,
            description: description,
            level: level,
            isAdmin: isAdmin,
            isStaff: isStaff,
            isCustomer: isCustomer
        })
        const response = await permissionAPI.update(query)
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
                                    <i className="fas fa-edit mr-2"></i>
                                    Cập nhật quyền
                                </h4>
                                
                                {isSystem && (
                                    <div className="alert alert-warning">
                                        <i className="fas fa-exclamation-triangle mr-2"></i>
                                        <strong>Quyền hệ thống:</strong> Đây là quyền hệ thống quan trọng. 
                                        Hãy cẩn thận khi chỉnh sửa!
                                    </div>
                                )}

                                {userCount > 0 && (
                                    <div className="alert alert-info">
                                        <i className="fas fa-users mr-2"></i>
                                        <strong>Lưu ý:</strong> Hiện có <strong>{userCount}</strong> người dùng đang sử dụng quyền này.
                                    </div>
                                )}

                                {
                                    validationMsg.api === "Bạn đã update thành công" ?
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

                                <form onSubmit={handleSubmit(handleUpdate)}>
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
                                                    <option value="10">10 - Khách hàng (Customer)</option>
                                                    <option value="50">50 - Nhân viên (Staff)</option>
                                                    <option value="100">100 - Quản trị (Admin)</option>
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
                                            </div>

                                            {userCount > 0 && (
                                                <div className="alert alert-warning">
                                                    <i className="fas fa-exclamation-triangle mr-2"></i>
                                                    <strong>Cảnh báo:</strong>
                                                    <ul className="mb-0 mt-2">
                                                        <li>Thay đổi cấp độ sẽ ảnh hưởng đến {userCount} người dùng</li>
                                                        <li>Người dùng có thể mất một số quyền truy cập</li>
                                                        <li>Hãy thông báo cho người dùng trước khi thay đổi</li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary">
                                        <i className="fas fa-save mr-2"></i>
                                        Cập nhật
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

export default UpdatePermission;
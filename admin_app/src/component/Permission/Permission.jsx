import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string'

import permissionAPI from '../Api/permissionAPI';
import Pagination from '../Shared/Pagination'
import Search from '../Shared/Search'

function Permission(props) {
    const [filter, setFilter] = useState({
        page: '1',
        limit: '4',
        search: '',
        status: true
    })

    const [permission, setPermission] = useState([])
    const [totalPage, setTotalPage] = useState()
    const [deleteError, setDeleteError] = useState('')

    useEffect(() => {
        const query = '?' + queryString.stringify(filter)

        const fetchAllData = async () => {
            const ct = await permissionAPI.getAPIPage(query)
            setTotalPage(ct.totalPage)
            setPermission(ct.permission)
        }

        fetchAllData()
    }, [filter])

    const onPageChange = (value) => {
        setFilter({
            ...filter,
            page: value
        })
    }

    const handlerSearch = (value) => {
        setFilter({
            ...filter,
            page: '1',
            search: value
        })
    }

    const handleDelete = async (value) => {
        // Check if system permission
        if (value.isSystem) {
            setDeleteError('Không thể xóa quyền hệ thống!')
            setTimeout(() => setDeleteError(''), 3000)
            return
        }

        // Confirm before delete
        const confirmMsg = value.userCount > 0 
            ? `Có ${value.userCount} người dùng đang sử dụng quyền này. Bạn có chắc chắn muốn xóa?`
            : 'Bạn có chắc chắn muốn xóa quyền này?'
        
        if (!window.confirm(confirmMsg)) {
            return
        }

        const query = '?' + queryString.stringify({ id: value._id })
        const response = await permissionAPI.delete(query)

        if (response.msg === "Thanh Cong") {
            setFilter({
                ...filter,
                status: !filter.status
            })
            setDeleteError('')
        } else {
            setDeleteError(response.msg)
            setTimeout(() => setDeleteError(''), 5000)
        }
    }

    const getLevelBadge = (level) => {
        if (level >= 100) return <span className="badge badge-danger">Cao nhất</span>
        if (level >= 50) return <span className="badge badge-warning">Trung bình</span>
        // Treat any unknown or lower-than-10 levels as 'Thấp' to remove the 'Mặc định' label
        return <span className="badge badge-info">Thấp</span>
    }

    const getRoleBadges = (perm) => {
        const badges = []
        if (perm.isAdmin) badges.push(<span key="admin" className="badge badge-danger mr-1">Admin</span>)
        if (perm.isStaff) badges.push(<span key="staff" className="badge badge-warning mr-1">Staff</span>)
        if (perm.isCustomer) badges.push(<span key="customer" className="badge badge-info mr-1">Customer</span>)
        return badges.length > 0 ? badges : <span className="badge badge-secondary">Custom</span>
    }

    return (
        <div className="page-wrapper">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">
                                    <i className="fas fa-shield-alt mr-2"></i>
                                    Quản lý Phân Quyền
                                </h4>
                                
                                {deleteError && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        <i className="fas fa-exclamation-circle mr-2"></i>
                                        {deleteError}
                                        <button type="button" className="close" onClick={() => setDeleteError('')}>
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </div>
                                )}

                                <Search handlerSearch={handlerSearch} />

                                <Link to="/permission/create" className="btn btn-primary my-3">
                                    <i className="fas fa-plus mr-2"></i>
                                    Tạo quyền mới
                                </Link>


                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered no-wrap">
                                        <thead>
                                            <tr>
                                                <th width="20%">Tên quyền</th>
                                                <th width="30%">Mô tả</th>
                                                <th width="10%">Cấp độ</th>
                                                <th width="15%">Loại</th>
                                                <th width="10%">Người dùng</th>
                                                <th width="15%">Hành động</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                permission && permission.map((value, index) => (
                                                    <tr key={index} className={value.isSystem ? 'table-warning' : ''}>
                                                        <td className="name">
                                                            <strong>{value.permission}</strong>
                                                            {value.isSystem && (
                                                                <span className="badge badge-warning ml-2">
                                                                    <i className="fas fa-lock"></i> Hệ thống
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <small className="text-muted">
                                                                {value.description || 'Chưa có mô tả'}
                                                            </small>
                                                        </td>
                                                        <td>{getLevelBadge(value.level)}</td>
                                                        <td>{getRoleBadges(value)}</td>
                                                        <td className="text-center">
                                                            <span className={`badge ${value.userCount > 0 ? 'badge-success' : 'badge-secondary'}`}>
                                                                <i className="fas fa-users mr-1"></i>
                                                                {value.userCount || 0}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <Link 
                                                                    to={"/permission/update/" + value._id} 
                                                                    className="btn btn-sm btn-success mr-1"
                                                                    title="Cập nhật"
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </Link>

                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => handleDelete(value)} 
                                                                    style={{ cursor: 'pointer' }} 
                                                                    className={`btn btn-sm ${value.isSystem || value.userCount > 0 ? 'btn-secondary' : 'btn-danger'}`}
                                                                    disabled={value.isSystem}
                                                                    title={value.isSystem ? 'Không thể xóa quyền hệ thống' : value.userCount > 0 ? `${value.userCount} người dùng đang sử dụng` : 'Xóa'}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    <Pagination filter={filter} onPageChange={onPageChange} totalPage={totalPage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer text-center text-muted">
                All Rights Reserved by Adminmart. Designed and Developed by <a
                    href="https://www.facebook.com/KimTien.9920/">Tiền Kim</a>.
        </footer>
        </div>
    );
}

export default Permission;
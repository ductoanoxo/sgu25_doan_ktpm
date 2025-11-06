import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import orderAPI from '../Api/orderAPI';
import Pagination from '../Shared/Pagination';

// Datepicker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';

function CompletedOrder() {
  const [filter, setFilter] = useState({
    page: '1',
    limit: '10',
  });

  const [ordersRaw, setOrdersRaw] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Bộ lọc theo ngày (frontend) - dùng Date | null
  const [dateFrom, setDateFrom] = useState(null); // Date | null
  const [dateTo, setDateTo] = useState(null);     // Date | null
  const [errMessage, setErrMessage] = useState('');
  const [subMessage, setSubMessage] = useState('');

  // Fetch đơn hoàn thành
  useEffect(() => {
    const query =
      '?' + queryString.stringify(filter, { skipEmptyString: true, skipNull: true });

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await orderAPI.completeOrder(query);
        const list = Array.isArray(res?.orders) ? res.orders : [];
        setOrdersRaw(list);
      } catch (err) {
        console.error(err);
        setError('Không tải được dữ liệu.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  // Parse chuỗi dd/MM/yyyy thành Date object
  const parseDateDMY = (str) => {
    if (!str) return null;
    const [d, m, y] = String(str).split('/');
    if (!d || !m || !y) return null;
    const date = new Date(+y, +m - 1, +d);
    return isNaN(date) ? null : date;
  };

  // Lọc client theo status = 4 (hoàn thành) + khoảng ngày
  const filteredOrders = useMemo(() => {
    const completed = ordersRaw.filter((o) => String(o.status) === '4');

    if (!dateFrom && !dateTo) return completed;

    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    if (to) to.setHours(23, 59, 59, 999);

    return completed.filter((o) => {
      const od = parseDateDMY(o.create_time);
      if (!od) return false;
      if (from && od < from) return false;
      if (to && od > to) return false;
      return true;
    });
  }, [ordersRaw, dateFrom, dateTo]);

  const totalMoney = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  }, [filteredOrders]);

  const pageSize = Number(filter.limit) || 10;
  const currentPage = Number(filter.page) || 1;
  const totalPage = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  const displayOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const onPageChange = (val) => {
    setFilter((prev) => ({ ...prev, page: val }));
  };

  // Khi nhấn Lọc
  const handlerStatistic = (e) => {
    e.preventDefault();
    if (!dateFrom || !dateTo) {
      setErrMessage('Vui lòng chọn đủ Từ ngày và Đến ngày!');
      setSubMessage('');
      return;
    }
    if (dateFrom > dateTo) {
      setErrMessage('Khoảng ngày không hợp lệ!');
      setSubMessage('');
      return;
    }
    setErrMessage('');
    setSubMessage('Đã lọc hóa đơn hoàn thành theo khoảng thời gian!');
  };

  // Reset bộ lọc
  const handleResetFilter = () => {
    setDateFrom(null);
    setDateTo(null);
    setErrMessage('');
    setSubMessage('');
  };

  // In PDF
  const handler_Report = () => {
    const container = document.getElementById('customers');
    if (!container) return;
    const sTable = container.innerHTML;
    const style =
      '<style>table{width:100%;font:17px Calibri;}table,th,td{border:1px solid #DDD;border-collapse:collapse;padding:4px;text-align:center;}</style>';
    const win = window.open('', '', 'height=900,width=1000');
    win.document.write('<html><head><title>Report</title>' + style + '</head><body>');
    win.document.write(sTable);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Complete Orders</h4>

                {/* Bộ lọc */}
                <div style={{ marginBottom: 20 }}>
                  <div className="d-flex align-items-center gap-2" style={{ flexWrap: 'wrap' }}>
                    <div style={{ display: 'inline-block' }}>
                      <label style={{ marginRight: 8 }}>Từ ngày:</label>
                      <div style={{ display: 'inline-block', width: 200 }}>
                        <DatePicker
                          selected={dateFrom}
                          onChange={(d) => setDateFrom(d)}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="form-control"
                          locale={vi}
                          maxDate={dateTo || undefined}
                          isClearable
                          shouldCloseOnSelect
                        />
                      </div>
                    </div>

                    <div style={{ display: 'inline-block' }}>
                      <label style={{ marginRight: 8 }}>Đến ngày:</label>
                      <div style={{ display: 'inline-block', width: 200 }}>
                        <DatePicker
                          selected={dateTo}
                          onChange={(d) => setDateTo(d)}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="form-control"
                          locale={vi}
                          minDate={dateFrom || undefined}
                          isClearable
                          shouldCloseOnSelect
                        />
                      </div>
                    </div>

                    <button className="btn btn-primary" onClick={handlerStatistic}>
                      Lọc Hóa Đơn
                    </button>
                    <button className="btn btn-secondary" onClick={handleResetFilter}>
                      Xóa Bộ Lọc
                    </button>
                  </div>
                  {errMessage && <p className="text-danger mt-2 mb-0">{errMessage}</p>}
                  {subMessage && <p className="text-success mt-2 mb-0">{subMessage}</p>}
                  {error && <p className="text-danger mt-2 mb-0">{error}</p>}
                </div>

                {/* Bảng */}
                <div className="table-responsive" id="customers">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Ngày tạo</th>
                        <th>Tổng tiền</th>
                        <th>Thanh toán</th>
                        <th>Trạng thái</th>
                        <th>Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={10}>Đang tải...</td>
                        </tr>
                      ) : displayOrders.length === 0 ? (
                        <tr>
                          <td colSpan={10}>Không có đơn phù hợp.</td>
                        </tr>
                      ) : (
                        displayOrders.map((value, index) => (
                          <tr key={index}>
                            <td>{value._id}</td>
                            <td>{value.id_note?.fullname || 'N/A'}</td>
                            <td>{value.id_user?.email || 'N/A'}</td>
                            <td>{value.id_note?.phone || 'N/A'}</td>
                            <td>{value.address}</td>
                            {/* create_time đã là dd/MM/yyyy từ backend */}
                            <td>{value.create_time}</td>
                            <td>
                              {new Intl.NumberFormat('vi-VN').format(Number(value.total) || 0)} VNĐ
                            </td>
                            <td>{value.pay ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                            <td>
                              {(() => {
                                switch (String(value.status)) {
                                  case '1':
                                    return 'Đang xử lý';
                                  case '2':
                                    return 'Đã xác nhận';
                                  case '3':
                                    return 'Đang giao';
                                  case '4':
                                    return 'Hoàn thành';
                                  default:
                                    return 'Đã hủy';
                                }
                              })()}
                            </td>
                            <td>
                              <Link to={`/order/detail/${value._id}`} className="btn btn-info btn-sm">
                                Xem
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  <h4>
                    Tổng tiền: {new Intl.NumberFormat('vi-VN').format(totalMoney)} VNĐ
                  </h4>
                </div>

                <Pagination filter={filter} onPageChange={onPageChange} totalPage={totalPage} />

                <br />
                <button className="btn btn-success" style={{ color: '#fff' }} onClick={handler_Report}>
                  In thống kê
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer text-center text-muted">
        All Rights Reserved by Adminmart. Designed and Developed by
        <a href="https://www.facebook.com/KimTien.9920/"> Tiền Kim</a>.
      </footer>
    </div>
  );
}

export default CompletedOrder;

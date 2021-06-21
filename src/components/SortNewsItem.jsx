import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchNewsThunk, sortByName } from '../store/reducers/NewsSlide';

export default function SortItem() {
    const [orderBy, setOrderBy] = useState('date');
    const [typeSort, setTypeSort] = useState(false);
    const dispatch = useDispatch();

    const handleRefresh = () => {
        dispatch(fetchNewsThunk(10));
    };
    
    const handleOrderBy = (e) => {
        setOrderBy(e.target.value);
        dispatch(sortByName({ typeSort, orderBy: e.target.value }));
    };
    const handleTypeSort = (e) => {
        setTypeSort(e.target.value);
        dispatch(
            sortByName({
                typeSort: e.target.value,
                orderBy,
            })
        );
    };
    return (
        <div
            className="input-group mt-3"
            role="group"
            aria-label="Basic example"
        >
            <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleRefresh}
            >
                Làm mới
            </button>
            <span className="input-group-text" id="basic-addon1">
                Sắp xếp
            </span>
            <select
                className="form-select"
                aria-label="Default select example"
                value={orderBy}
                onChange={handleOrderBy}
            >
                <option value="name">Tên</option>
                <option value="target">Tiêu chí</option>
                <option value="date">Thời gian</option>
                <option value="numPeople">Số người</option>
            </select>
            <select
                className="form-select"
                aria-label="Default select example"
                value={typeSort}
                onChange={handleTypeSort}
            >
                <option value={true}>Tăng dần</option>
                <option value={false}>Giảm dần</option>
            </select>
        </div>
    );
}

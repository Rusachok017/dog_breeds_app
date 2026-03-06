import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBreeds, addBreed, updateBreed, deleteBreed } from '../features/breedsSlice';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const dispatch = useDispatch();
    const breeds = useSelector((state) => state.breeds.list);
    const status = useSelector((state) => state.breeds.status);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        description: '',
        life_span: '',
        image: '',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    const navigate = useNavigate();

    // Получаем токен из localStorage
    const token = localStorage.getItem('token');
    const user = token ? JSON.parse(atob(token.split('.')[1])) : null; // Декодируем токен
    const isAdmin = user?.role === 'admin';
    console.log('JWT Token:', token);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchBreeds());
        }
    }, [dispatch, status]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAdd = () => {
        setFormData({
            id: null,
            name: '',
            description: '',
            life_span: '',
            image: '',
        });
        setIsModalOpen(true);
    };

    const handleEdit = (breed) => {
        setFormData({ ...breed, id: Number(breed.id) }); // Преобразуем ID в число
        window.scrollTo(0,0);
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        if (formData.id) {
            dispatch(updateBreed({ id: formData.id, updatedData: formData }));
        } else {
            dispatch(addBreed(formData));
        }
        setIsModalOpen(false);
        setFormData({
            id: null,
            name: '',
            description: '',
            life_span: '',
            image: '',
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this breed?')) {
            dispatch(deleteBreed(id));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    // Фильтрация пород по имени
    const filteredBreeds = breeds.filter((breed) =>
        breed.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Сортировка пород
    const sortedBreeds = [...filteredBreeds].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className={`p-4`}>
            <h1>Dog Breeds App</h1>

            {/* Кнопки Login/Register или Logout */}
            <div className="flex justify-end mb-4">
                {token ? (
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <>
                        <button className="login-button mr-2" onClick={handleLogin}>
                            Login
                        </button>
                        <button className="register-button" onClick={handleRegister}>
                            Register
                        </button>
                    </>
                )}
            </div>

            {/* Поиск */}
            <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            {/* Сортировка */}
            <select value={sortField} onChange={(e) => setSortField(e.target.value)} className="sort-select">
                <option value="name">Name</option>
                <option value="life_span">Life Span</option>
            </select>
            <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="sort-button">
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>

            {/* Кнопка для открытия модального окна */}
            {isAdmin && <button onClick={handleAdd} className="add-breed-button">Add Breed</button>}

            {/* Список пород */}
            {status === 'loading' && <div>Loading...</div>}
            {status === 'failed' && <div>Error loading breeds</div>}
            {status === 'succeeded' && (
                <ul>
                    {sortedBreeds.map((breed) => (
                        <li key={breed.id} className="breed-item">
                            <img src={breed.image} alt={breed.name} />
                            <div className="breed-info">
                                <strong>{breed.name}</strong>
                                <p>{breed.description}</p>
                                <p>Life Span: {breed.life_span}</p>
                            </div>
                            <div className="breed-actions">
                                {isAdmin && (
                                    <>
                                        <button onClick={() => handleEdit(breed)} className="edit-button">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(breed.id)} className="delete-button">
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Модальное окно */}
            {isModalOpen && (
                <div className={`modal`}>
                    <div className="modal-content">
                        <h2>{formData.id ? 'Edit Breed' : 'Add Breed'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    className="form-textarea"
                                />
                            </div>
                            <div>
                                <label>Life Span:</label>
                                <input
                                    type="text"
                                    name="life_span"
                                    value={formData.life_span}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label>Image URL:</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="modal-buttons">
                                <button type="submit" className="save-button">
                                    Save
                                </button>
                                <button type="button"  onClick={() => setIsModalOpen(false)} className="cancel-button">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
import '../styles/Sidebar.css';
import { chkbox_options, radio_options } from '../data/globalData';
import { useCallback, useEffect, useState } from 'react';
import { axiosPublic } from '../configurations/axiosConfig';
import { useDispatch } from 'react-redux';
import { setProducts } from '../reducers/cartSlice';

export default function SideBar() {

    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState();
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [selectedDiscountRange, setSelectedDiscountRange] = useState(null);
    const [activeIdCat, setActiveIdCat] = useState(0);
    const [activeIdsPri, setActiveIdsPri] = useState([]);
    const [activeIdDis, setActiveIdDis] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        axiosPublic.get('/getallcategories').then(response => {
            if (response.status === 200) setCategories(response.data);
        })
    }, [dispatch]);

    const fetchFilteredProducts = useCallback(() => {
        let url = `/products/filter?`;

        // const { min: minPrice, max: maxPrice } = selectedPriceRanges;
        // const { min: minDiscount, max: maxDiscount } = selectedDiscountRange;

        // category
        if (selectedCategory) url += `category=${selectedCategory}&`;

        // price
        if (selectedPriceRanges.length > 0) {
            const minPrice = Math.min(...selectedPriceRanges.map(r => r.min));
            const maxCalc = Math.max(...selectedPriceRanges.map(r => r.max));
            const maxPrice = maxCalc === Infinity ? null : maxCalc;

            url += `minPrice=${minPrice}&`;
            if (maxPrice != null) url += `maxPrice=${maxPrice}&`;
        }

        // discount
        if (selectedDiscountRange) {
            const discountRange = radio_options.find(item => item.id === selectedDiscountRange);
            if (discountRange) {
                url += `minDiscount=${discountRange.min}&`;
                if (discountRange.max !== Infinity) url += `maxDiscount=${discountRange.max}&`;
            }
        }

        // all products
        if (url.endsWith('&')) url = url.slice(0, -1);
        if (url.endsWith('?')) url = url.slice(0, -1);

        axiosPublic.get(url)
            .then(res => dispatch(setProducts(res.data)));
    }, [selectedCategory, selectedPriceRanges, selectedDiscountRange, dispatch]);

    useEffect(() => {
        // if (selectedCategory || selectedPriceRanges.length > 0 || selectedDiscountRange)
        fetchFilteredProducts();
    }, [selectedCategory, selectedPriceRanges, selectedDiscountRange, fetchFilteredProducts]);

    function handlePriceChange(e, option) {
        if (e.target.checked) {
            setSelectedPriceRanges(prev => [...prev, option]);
            setActiveIdsPri(prev => [...prev, option.id]);
        } else {
            setSelectedPriceRanges(prev => prev.filter(item => item.id !== option.id));
            setActiveIdsPri(prev => prev.filter(id => id !== option.id));
        }
    }

    function fetchAllProducts() {
        setSelectedCategory(null);
        setSelectedPriceRanges([]);
        setSelectedDiscountRange(null);
        setActiveIdCat(0);       // highlight "All Products"
        setActiveIdsPri([]);     // clear all price highlights
        setActiveIdDis(null);
        // fetchFilteredProducts();
    }

    // const fetchByPrice = useCallback(() => {
    //     if (selectedValues.length === 0) return;

    //     const ranges = selectedValues.map(id => chkbox_options.find(item => item.id === id));

    //     const min = Math.min(...ranges.map(r => r.min));
    //     const max = Math.max(...ranges.map(r => r.max));

    //     axiosPublic.get(`/products/price?min=${min}${max === Infinity ? '' : `&max=${max}`}`)
    //         .then(res => {
    //             dispatch(setProducts(res.data))
    //         });

    // }, [selectedValues, dispatch]);

    // useEffect(() => fetchByPrice(), [selectedValues, fetchByPrice]);

    // function fetchByCategory(catid) {
    //     axiosPublic.get(`/products/category/${catid}`)
    //         .then(response => dispatch(setProducts(response.data)));
    // }

    // function handleChecked(e, value) {
    //     if (e.target.checked)
    //         setSelectedPriceRange((prev) => [...prev, value]);
    //     else
    //         setSelectedPriceRange((prev) => prev.filter((item) => item !== value));
    // }

    // const handleDiscountFetch = useCallback(() => {
    //     if (!selectedValue) return;

    //     const option = radio_options.find(item => item.id === selectedValue);
    //     if (!option) return;

    //     axiosPublic.get(`/products/discount?min=${option.min}${option.max === Infinity ? '' : `&max=${option.max}`}`)
    //         .then(res => {
    //             dispatch(setProducts(res.data));
    //         });
    // }, [selectedValue, dispatch]);

    // useEffect(() => handleDiscountFetch(), [selectedValues, handleDiscountFetch]);  

    return (
        <div className="aside">
            <div className='sec'>
                <h3 className='mar-t-0'>Categories</h3>
                <p className={activeIdCat === 0 ? "active" : ""}
                    onClick={() => { fetchAllProducts(); setActiveIdCat(0); }}>All Products</p>
                {categories.map((item) => <p key={item.id} className={activeIdCat === item.id ? "active" : ""}
                    onClick={() => { setSelectedCategory(item.id); setActiveIdCat(item.id); }}>{item.name}</p>)}
            </div>
            <div className='sec'>
                <h3>Price</h3>
                {chkbox_options.map((option) => (
                    <div className='chkbox' key={option.id}>
                        <label className={activeIdsPri.includes(option.id) ? "active" : ""}>
                            <input
                                type="checkbox"
                                value={option.id}
                                checked={selectedPriceRanges.some(item => item.id === option.id)}
                                onChange={(e) => handlePriceChange(e, option)}
                            /> {option.label}
                        </label>
                    </div>
                ))}
            </div>
            <div className='sec'>
                <h3>Discount</h3>
                {radio_options.map((option) => (
                    <div className='chkbox' key={option.id}>
                        <label className={activeIdDis === option.id ? "active" : ""}>
                            <input
                                type="radio"
                                name='radio-grp'
                                value={option.id}
                                checked={selectedDiscountRange === (option.id)}
                                onChange={(e) => { setSelectedDiscountRange(option.id); setActiveIdDis(option.id); }}
                            /> {option.label}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
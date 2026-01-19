// const [selectedVeggies, setSelectedVeggies] = useState(() =>
//     Array.isArray(cookies.selectedVeggies) ? cookies.selectedVeggies : []
// );

// useEffect(() => {
//     setCookies('selectedVeggies', selectedVeggies, { path: '/', maxAge: 86400 });
//     dispatch(updateCartCount(selectedVeggies.length));
// }, [selectedVeggies, setCookies, dispatch]);

// function veggiesPush(item) {
//     const updated = [item, ...selectedVeggies];
//     setSelectedVeggies(updated);
//     dispatch(updateCartCount(updated.length));
// }

// function addToCart(item) {
//     const updatedItem = veggies.find(val => val.id === item.id && val.orderedquantity > 0);
//     if (!updatedItem) {
//         toast.warn("Please select a quantity before adding!");;
//         return;
//     }

//     // const alreadyAdded = selectedVeggies.some(item => item.id === val.id);
// const alreadyAddedIndex = selectedVeggies.findIndex(val => val.id === item.id);

// if (alreadyAddedIndex !== -1) {
//     dispatch(updateAddMore({
//         show: true, name: item.name,
//         quantity: (item.orderedquantity * item.quantity), item: item
//     }));

//         const updatedCart = [...selectedVeggies];
//         updatedCart.unshift(updatedCart.splice(alreadyAddedIndex, 1)[0]);
//         setSelectedVeggies(updatedCart);
//     } else {
//         veggiesPush(updatedItem);
//     }
// }

// function addMoreToCart(item) {
//     const alreadyAdded = selectedVeggies.some(val => val.id === item.id);

//     if (alreadyAdded) {
//         const updated = selectedVeggies.map(val =>
//             val.id === item.id
//                 ? { ...val, orderedquantity: val.orderedquantity + item.orderedquantity }
//                 : val
//         );
//         setSelectedVeggies(updated);
//         dispatch(updateCartCount(updated.length));
//         dispatch(updateAddMore({ show: false }));
//     }
// }

// function incQuantity(id, flag) {
//     const loop = prev => prev.map((item) => item.id === id ? { ...item, orderedquantity: item.orderedquantity + 1 } : item);
//     flag ? setSelectedVeggies(loop) : setVeggies(loop);
// }

// function decQuantity(id, flag) {
//     if (flag) {
//         // setVeggies(prev => prev.map((item) => item.id === id ? { ...item, addedToCart: false } : item));
//         setSelectedVeggies(prev =>
//             prev.map(item => {
//                 // item.id === id ? { ...item, orderedQuantity: item.orderedQuantity - 1 >= 0 ? item.orderedQuantity - 1 : item.orderedQuantity } : item
//                 if (item.id === id) {
//                     const newQty = Math.max(0, item.orderedquantity - 1);
//                     if (newQty === 0) {
//                         const updated = selectedVeggies.filter(val => val.id !== item.id);
//                         setSelectedVeggies(updated);
//                         dispatch(updateCartCount(updated.length));
//                     }
//                     return { ...item, orderedquantity: newQty };
//                 }
//                 else return item;
//             })
//         );
//     }
//     else
//         setVeggies(prev => prev.map((item) => item.id === id ? { ...item, orderedquantity: Math.max(0, item.orderedquantity - 1) } : item));
// }

// function deleteVeg(id) {
//     // setVeggies(prev => prev.map((item) => item.id === id ? { ...item, addedToCart: false } : item));
//     // setSelectedVeggies(prev => prev.map(item => item.id === id ? { ...item, orderedQuantity: 0, addedToCart: false } : item));
//     const updated = selectedVeggies.filter(item => item.id !== id);
//     setSelectedVeggies(updated);
//     dispatch(updateCartCount(updated.length));
// }





// filter using each category separately
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






// export const vegetables = [
//     {
//         id: 1,
//         name: 'Raw Banana',
//         url: 'https://www.bbassets.com/media/uploads/p/l/40084197_1-fresho-banana-robusta-direct-institutional.jpg',
//         mrp: 45,
//         discount: 10,
//         quantity: 1,
//         orderedquantity: 0,
//         // addedToCart: false
//     },
//     {
//         id: 2,
//         name: 'Beetroot',
//         url: 'https://www.bbassets.com/media/uploads/p/l/40077504_1-fresho-beetroot-economy-institutional.jpg',
//         mrp: 40,
//         discount: 24,
//         quantity: 1,
//         orderedquantity: 0,
//         // addedToCart: false
//     },
//     {
//         id: 3,
//         name: 'Potato',
//         url: 'https://www.bbassets.com/media/uploads/p/l/40084104_1-fresho-baby-potato-premium-institutional.jpg',
//         mrp: 60,
//         discount: 55,
//         quantity: 1,
//         orderedquantity: 0,
//         // addedToCart: false
//     },
//     {
//         id: 4,
//         name: 'Onion',
//         url: 'https://www.bbassets.com/media/uploads/p/l/40077516_1-fresho-onion-b-grade.jpg',
//         mrp: 55,
//         discount: 24,
//         quantity: 0.50,
//         orderedquantity: 0,
//         // addedToCart: false
//     },
//     {
//         id: 5,
//         name: 'Brinjal',
//         url: 'https://www.bbassets.com/media/uploads/p/l/40183210_3-fresho-brinjal-varikatri.jpg',
//         mrp: 65,
//         discount: 20,
//         quantity: 1,
//         orderedquantity: 0,
//         // addedToCart: false
//     },
//     {
//         id: 6,
//         name: 'Drumstick',
//         url: 'https://www.bbassets.com/media/uploads/p/l/30004131_4-organic-drumstick.jpg',
//         mrp: 23,
//         discount: 10,
//         quantity: 0.25,
//         orderedquantity: 0,
//         // addedToCart: false
//     },
//     {
//         id: 7,
//         name: 'Bitter Gourd',
//         url: 'https://www.bbassets.com/media/uploads/p/l/40204123_2-fresho-bitter-gourd-small.jpg',
//         mrp: 48,
//         discount: 10,
//         quantity: 0.75,
//         orderedquantity: 0,
//         // addedToCart: false
//     },
//     {
//         id: 8,
//         name: 'Beans',
//         url: 'https://www.bbassets.com/media/uploads/p/l/40099650_2-fresho-field-beans-wal-premium-institutional.jpg',
//         mrp: 35,
//         discount: 24,
//         quantity: 0.75,
//         orderedquantity: 0,
//         // addedToCart: false
//     },
//     {
//         id: 9,
//         name: 'Tomato',
//         url: 'https://www.bbassets.com/media/uploads/p/l/40008413_3-tvs-organics-tomato-country.jpg',
//         mrp: 56,
//         discount: 24,
//         quantity: 0.25,
//         orderedquantity: 0,
//         // addedToCart: false
//     },
//     {
//         id: 10,
//         name: 'Carrot',
//         url: 'https://www.bbassets.com/media/uploads/p/l/40254430_1-fresho-orange-carrot-with-leaves-rich-in-vitamin-c-good-for-eyesight-bone-health.jpg',
//         mrp: 32,
//         discount: 5,
//         quantity: 0.50,
//         orderedquantity: 0,
//         // addedToCart: false
//     },
//     {
//         id: 11,
//         name: 'Zucchini',
//         url: 'https://www.bbassets.com/media/uploads/p/m/40094276_1-fresho-zucchini-green-direct.jpg',
//         mrp: 35,
//         discount: 24,
//         quantity: 0.25,
//         orderedquantity: 0,
//         // addedToCart: false
//     },
//     {
//         id: 12,
//         name: 'Broccoli',
//         url: 'https://www.bbassets.com/media/uploads/p/l/40084095_1-fresho-broccoli-premium-institutional.jpg',
//         mrp: 42,
//         discount: 35,
//         quantity: 1,
//         orderedquantity: 0,
//         // addedToCart: false
//     },
// ]
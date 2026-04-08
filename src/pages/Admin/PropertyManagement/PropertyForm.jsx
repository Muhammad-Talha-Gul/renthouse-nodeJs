import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Form, Button, Row, Col, Spinner, Badge, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { adminPropertyStore, adminPropertyUpdate, fetchAdminPropertyById } from '../../../redux/actions/aminPropertiesActions';
import { showErrorToast, showSuccessToast } from '../../../services/alertService';
import PageHeader from '../../../components/Breadcrumb/PageHeader';
import ImageCropModal from '../../../components/ImageCropModal/ImageCropModal';
import './PropertyForm.css';

const PropertyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEditMode);
    const [cropModal, setCropModal] = useState(false);
    const [cropImage, setCropImage] = useState(null);
    const [cropField, setCropField] = useState(null);
    const [cropOptions, setCropOptions] = useState({ width: 400, height: 400, aspect: 1 });
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [showInstalment, setShowInstalment] = useState(false);

    const bannerInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    const categories = useSelector(state => state.adminProperties.categories) || [];
    const amunities = useSelector(state => state.adminProperties.amunities) || [];
    const features = useSelector(state => state.adminProperties.features) || [];



    const [formData, setFormData] = useState({
        title: "",
        category_id: "",
        listing_type: "rent",
        price: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        area_unit: "sqft",
        furnished: "unfurnished",
        description: "",
        address: "",
        city: "",
        state: "",
        country: "",
        latitude: "",
        longitude: "",
        status: "available",
        slug: "",
        banner_image: null,
        images: [],
        amenities: [],
        features: [],
        // Instalment Plan Fields
        instalment_available: false,
        down_payment: "",
        monthly_installment: "",
        installment_years: "",
        processing_fee: "",
        late_payment_fee: ""
    });

    // Add these state variables and functions inside your PropertyForm component

    const [downPaymentPercent, setDownPaymentPercent] = useState(0);

    // Calculate monthly installment based on down payment and tenure
    const calculateMonthlyInstallment = () => {
        const totalPrice = parseFloat(formData.price) || 0;
        const downPayment = parseFloat(formData.down_payment) || 0;
        const years = parseInt(formData.installment_years) || 0;
        const interestRate = parseFloat(formData.interest_rate) || 0;

        if (totalPrice === 0 || years === 0) return 0;

        const loanAmount = totalPrice - downPayment;
        if (loanAmount <= 0) return 0;

        const months = years * 12;

        // If interest rate is provided, use EMI formula
        if (interestRate > 0) {
            const monthlyRate = interestRate / 100 / 12;
            const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
            return Math.round(emi);
        }

        // Simple division if no interest
        return Math.round(loanAmount / months);
    };

    // Calculate total payment including down payment and all installments
    const calculateTotalPayment = () => {
        const downPayment = parseFloat(formData.down_payment) || 0;
        const monthlyInstallment = parseFloat(formData.monthly_installment) || 0;
        const years = parseInt(formData.installment_years) || 0;
        const processingFee = parseFloat(formData.processing_fee) || 0;

        const totalInstallments = monthlyInstallment * (years * 12);
        return downPayment + totalInstallments + processingFee;
    };

    // Calculate total installments amount
    const calculateTotalInstallments = () => {
        const monthlyInstallment = parseFloat(formData.monthly_installment) || 0;
        const years = parseInt(formData.installment_years) || 0;
        return monthlyInstallment * (years * 12);
    };

    // Calculate interest amount
    const calculateInterestAmount = () => {
        const totalPrice = parseFloat(formData.price) || 0;
        const downPayment = parseFloat(formData.down_payment) || 0;
        const totalPayment = calculateTotalPayment();
        const processingFee = parseFloat(formData.processing_fee) || 0;

        const loanAmount = totalPrice - downPayment;
        const totalPaid = totalPayment - downPayment - processingFee;

        return Math.max(0, totalPaid - loanAmount);
    };

    // Calculate down payment percentage
    const getDownPaymentPercentage = () => {
        const totalPrice = parseFloat(formData.price) || 0;
        const downPayment = parseFloat(formData.down_payment) || 0;

        if (totalPrice === 0) return 0;
        return Math.round((downPayment / totalPrice) * 100);
    };

    // Handle down payment percentage change
    const handleDownPaymentPercentChange = (e) => {
        const percent = parseFloat(e.target.value) || 0;
        setDownPaymentPercent(percent);

        const totalPrice = parseFloat(formData.price) || 0;
        const downPaymentAmount = (totalPrice * percent) / 100;

        setFormData(prev => ({
            ...prev,
            down_payment: Math.round(downPaymentAmount)
        }));

        // Recalculate monthly installment
        setTimeout(() => {
            const monthly = calculateMonthlyInstallment();
            setFormData(prev => ({
                ...prev,
                monthly_installment: monthly
            }));
        }, 0);
    };

    // Handle down payment amount change
    const handleDownPaymentAmountChange = (e) => {
        const amount = parseFloat(e.target.value) || 0;
        const totalPrice = parseFloat(formData.price) || 0;

        // Calculate percentage
        const percent = totalPrice > 0 ? (amount / totalPrice) * 100 : 0;
        setDownPaymentPercent(Math.round(percent));

        setFormData(prev => ({
            ...prev,
            down_payment: amount
        }));

        // Recalculate monthly installment
        setTimeout(() => {
            const monthly = calculateMonthlyInstallment();
            setFormData(prev => ({
                ...prev,
                monthly_installment: monthly
            }));
        }, 0);
    };

    // Handle installment period change
    const handleInstallmentChange = (e) => {
        const years = e.target.value;
        setFormData(prev => ({
            ...prev,
            installment_years: years
        }));

        // Recalculate monthly installment
        setTimeout(() => {
            const monthly = calculateMonthlyInstallment();
            setFormData(prev => ({
                ...prev,
                monthly_installment: monthly
            }));
        }, 0);
    };

    // Add useEffect to recalculate when price or interest rate changes
    useEffect(() => {
        if (showInstalment && formData.down_payment && formData.installment_years) {
            const monthly = calculateMonthlyInstallment();
            if (monthly !== formData.monthly_installment) {
                setFormData(prev => ({
                    ...prev,
                    monthly_installment: monthly
                }));
            }
        }
    }, [formData.price, formData.down_payment, formData.installment_years, formData.interest_rate, showInstalment]);

    // Initialize down payment percentage when editing
    useEffect(() => {
        if (formData.down_payment && formData.price) {
            const percent = (formData.down_payment / formData.price) * 100;
            setDownPaymentPercent(Math.round(percent));
        }
    }, [formData.down_payment, formData.price]);

    const [previewUrls, setPreviewUrls] = useState({
        banner_image: null,
        images: []
    });

    useEffect(() => {
        if (isEditMode) {
            loadPropertyData();
        }
    }, [id]);

    const loadPropertyData = async () => {
        try {
            setPageLoading(true);
            const response = await dispatch(fetchAdminPropertyById(id));
            const property = response.data || response;

            if (property) {
                let amenitiesArray = [];
                let featuresArray = [];

                if (property.amenities) {
                    if (typeof property.amenities === 'string') {
                        try {
                            amenitiesArray = JSON.parse(property.amenities);
                        } catch (e) {
                            amenitiesArray = [];
                        }
                    } else if (Array.isArray(property.amenities)) {
                        amenitiesArray = property.amenities.map(a => typeof a === 'object' ? a.id : a);
                    }
                }

                if (property.features) {
                    if (typeof property.features === 'string') {
                        try {
                            featuresArray = JSON.parse(property.features);
                        } catch (e) {
                            featuresArray = [];
                        }
                    } else if (Array.isArray(property.features)) {
                        featuresArray = property.features.map(f => typeof f === 'object' ? f.id : f);
                    }
                }

                setFormData({
                    title: property.title || "",
                    category_id: property.category_id || "",
                    listing_type: property.listing_type || "rent",
                    price: property.price || "",
                    bedrooms: property.bedrooms || "",
                    bathrooms: property.bathrooms || "",
                    area: property.area || "",
                    area_unit: property.area_unit || "sqft",
                    furnished: property.furnished || "unfurnished",
                    description: property.description || "",
                    address: property.address || "",
                    city: property.city || "",
                    state: property.state || "",
                    country: property.country || "",
                    latitude: property.latitude || "",
                    longitude: property.longitude || "",
                    status: property.status || "available",
                    slug: property.slug || "",
                    banner_image: property.banner_image || null,
                    images: property.images || [],
                    amenities: amenitiesArray,
                    features: featuresArray,
                    instalment_available: property.instalment_available || false,
                    down_payment: property.down_payment || "",
                    monthly_installment: property.monthly_installment || "",
                    installment_years: property.installment_years || "",
                    processing_fee: property.processing_fee || "",
                    late_payment_fee: property.late_payment_fee || ""
                });

                setShowInstalment(property.instalment_available || false);

                if (property.banner_image) {
                    setPreviewUrls(prev => ({
                        ...prev,
                        banner_image: property.banner_image
                    }));
                }

                if (property.images && property.images.length > 0) {
                    setPreviewUrls(prev => ({
                        ...prev,
                        images: property.images
                    }));
                }
            }
        } catch (error) {
            console.error("Error loading property:", error);
            showErrorToast("Failed to load property data");
            navigate('/admin/properties');
        } finally {
            setPageLoading(false);
        }
    };

    const handleFileSelect = async (e, field) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        if (field.type === 'file-single') {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setCropImage(reader.result);
                setCropField(field);
                setCropOptions(field.cropOptions || { width: 400, height: 400, aspect: 1 });
                setCropModal(true);
            };
            reader.readAsDataURL(file);
        } else {
            setUploadingImages(true);
            for (const file of files) {
                const reader = new FileReader();
                await new Promise((resolve) => {
                    reader.onload = () => {
                        setCropImage(reader.result);
                        setCropField({ ...field, file });
                        setCropOptions(field.cropOptions || { width: 800, height: 600, aspect: 4 / 3 });
                        setCropModal(true);
                        resolve();
                    };
                    reader.readAsDataURL(file);
                });
            }
            setUploadingImages(false);
        }

        e.target.value = null;
    };

    const handleCropComplete = (croppedFile) => {
        if (!cropField) return;

        if (cropField.type === 'file-multiple') {
            const currentImages = [...formData[cropField.name]];
            const newImages = [...currentImages, croppedFile];
            setFormData(prev => ({ ...prev, [cropField.name]: newImages }));

            const previewUrl = URL.createObjectURL(croppedFile);
            setPreviewUrls(prev => ({
                ...prev,
                images: [...prev.images, previewUrl]
            }));
        } else {
            setFormData(prev => ({ ...prev, [cropField.name]: croppedFile }));

            const previewUrl = URL.createObjectURL(croppedFile);
            setPreviewUrls(prev => ({
                ...prev,
                [cropField.name]: previewUrl
            }));
        }

        setCropModal(false);
        setCropImage(null);
        setCropField(null);
    };

    const handleRemoveImage = (fieldName, index) => {
        const images = [...(formData[fieldName] || [])];
        images.splice(index, 1);
        setFormData(prev => ({ ...prev, [fieldName]: images }));

        const previews = [...(previewUrls[fieldName] || [])];
        if (previews[index] && previews[index].startsWith('blob:')) {
            URL.revokeObjectURL(previews[index]);
        }
        previews.splice(index, 1);
        setPreviewUrls(prev => ({ ...prev, [fieldName]: previews }));

        if (primaryImageIndex >= previews.length) {
            setPrimaryImageIndex(Math.max(0, previews.length - 1));
        }
    };

    const handleRemoveSingle = (fieldName) => {
        if (previewUrls[fieldName] && previewUrls[fieldName].startsWith('blob:')) {
            URL.revokeObjectURL(previewUrls[fieldName]);
        }
        setFormData(prev => ({ ...prev, [fieldName]: null }));
        setPreviewUrls(prev => ({ ...prev, [fieldName]: null }));
    };

    const handleSetPrimaryImage = (index) => {
        setPrimaryImageIndex(index);
        showSuccessToast(`Image ${index + 1} set as primary`);
    };

    const toggleSelection = (type, id) => {
        const currentValues = [...(formData[type] || [])];
        if (currentValues.includes(id)) {
            setFormData(prev => ({
                ...prev,
                [type]: currentValues.filter(item => item !== id)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [type]: [...currentValues, id]
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (name === 'instalment_available') {
                setShowInstalment(checked);
                setFormData(prev => ({ ...prev, [name]: checked }));
            } else {
                setFormData(prev => ({ ...prev, [name]: checked }));
            }
            return;
        }

        if (name === "title") {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            setFormData(prev => ({
                ...prev,
                title: value,
                slug: slug
            }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const submitData = new FormData();

        Object.keys(formData).forEach((key) => {
            const value = formData[key];

            if (key === 'amenities' || key === 'features') {
                if (Array.isArray(value) && value.length > 0) {
                    submitData.append(key, JSON.stringify(value));
                } else {
                    submitData.append(key, JSON.stringify([]));
                }
            } else if (key === 'images' && Array.isArray(value)) {
                value.forEach((file) => {
                    if (file instanceof File) {
                        submitData.append('images[]', file);
                    }
                });
            } else if (key === 'banner_image' && value instanceof File) {
                submitData.append('banner_image', value);
            } else if (value !== null && value !== undefined && typeof value !== 'object') {
                submitData.append(key, value);
            }
        });

        submitData.append('primary_image', primaryImageIndex);

        try {
            let response;
            if (isEditMode) {
                response = await dispatch(adminPropertyUpdate(id, submitData));
            } else {
                response = await dispatch(adminPropertyStore(submitData));
            }

            const isSuccess = response?.status === true || response?.success === true;

            if (isSuccess) {
                showSuccessToast(isEditMode ? "Property updated successfully!" : "Property created successfully!");
                navigate('/admin/properties');
            } else {
                const errorMsg = response?.message || response?.error || "Something went wrong!";
                showErrorToast(errorMsg);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            const errorMsg = error?.response?.data?.message || error?.message || "An unexpected error occurred!";
            showErrorToast(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrls.banner_image && previewUrls.banner_image.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrls.banner_image);
            }
            previewUrls.images.forEach(url => {
                if (url && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, []);

    if (pageLoading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading property data...</p>
            </div>
        );
    }

    return (
        <>
            <div className="property-form-page">
                <div className="property-form-container">
                    <Form onSubmit={handleSubmit}>
                        {/* Banner Image Section - Redesigned */}
                        <div className="form-section banner-section">
                            <div className="section-header">
                                <div className="section-icon">
                                    <i className="bi bi-image"></i>
                                </div>
                                <div>
                                    <h3 className="section-title">Banner Image</h3>
                                    <p className="section-subtitle">This image will be displayed as the main banner of your property</p>
                                </div>
                            </div>

                            <div className="banner-upload-area">
                                {previewUrls.banner_image ? (
                                    <div className="banner-preview-wrapper">
                                        <img src={previewUrls.banner_image} alt="Banner" className="banner-preview-image" />
                                        <div className="banner-actions">
                                            <button type="button" className="action-btn edit" onClick={() => bannerInputRef.current.click()}>
                                                <i className="bi bi-pencil"></i> Change
                                            </button>
                                            <button type="button" className="action-btn delete" onClick={() => handleRemoveSingle('banner_image')}>
                                                <i className="bi bi-trash"></i> Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="banner-upload-placeholder" onClick={() => bannerInputRef.current.click()}>
                                        <div className="upload-icon-wrapper">
                                            <i className="bi bi-cloud-upload"></i>
                                        </div>
                                        <h5>Click to upload banner image</h5>
                                        <p>Recommended: 1200 x 400 pixels | Max size: 5MB</p>
                                        <button type="button" className="upload-btn">Select Image</button>
                                    </div>
                                )}
                                <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                                    onChange={(e) => handleFileSelect(e, { name: 'banner_image', type: 'file-single', cropOptions: { width: 1200, height: 400, aspect: 3 } })} />
                            </div>
                        </div>

                        <div className="form-row two-columns">
                            {/* Basic Information */}
                            <div className="form-section">
                                <div className="section-header">
                                    <div className="section-icon"><i className="bi bi-info-circle"></i></div>
                                    <div>
                                        <h3 className="section-title">Basic Information</h3>
                                        <p className="section-subtitle">Essential details about your property</p>
                                    </div>
                                </div>

                                <div className="section-content">
                                    <div className="form-group">
                                        <label>Property Title <span className="required">*</span></label>
                                        <input type="text" name="title" value={formData.title} onChange={handleInputChange}
                                            placeholder="Enter a descriptive title" className="form-control modern" />
                                    </div>

                                    <div className="form-row two-columns">
                                        <div className="form-group">
                                            <label>Category <span className="required">*</span></label>
                                            <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="form-control modern">
                                                <option value="">Select Category</option>
                                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Listing Type <span className="required">*</span></label>
                                            <select name="listing_type" value={formData.listing_type} onChange={handleInputChange} className="form-control modern">
                                                <option value="rent">For Rent</option>
                                                <option value="sale">For Sale</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row three-columns">
                                        <div className="form-group">
                                            <label>Price <span className="required">*</span></label>
                                            <div className="input-group-modern">
                                                <span className="currency">$</span>
                                                <input type="number" name="price" value={formData.price} onChange={handleInputChange}
                                                    placeholder="Enter price" className="form-control modern" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Bedrooms</label>
                                            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange}
                                                placeholder="Number of bedrooms" className="form-control modern" />
                                        </div>
                                        <div className="form-group">
                                            <label>Bathrooms</label>
                                            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange}
                                                placeholder="Number of bathrooms" className="form-control modern" />
                                        </div>
                                    </div>

                                    <div className="form-row two-columns">
                                        <div className="form-group">
                                            <label>Area</label>
                                            <div className="input-group-modern">
                                                <input type="number" name="area" value={formData.area} onChange={handleInputChange}
                                                    placeholder="Area size" className="form-control modern" />
                                                <select name="area_unit" value={formData.area_unit} onChange={handleInputChange} className="unit-select">
                                                    <option value="sqft">Sq Ft</option>
                                                    <option value="marla">Marla</option>
                                                    <option value="kanal">Kanal</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Furnished Status</label>
                                            <select name="furnished" value={formData.furnished} onChange={handleInputChange} className="form-control modern">
                                                <option value="furnished">Furnished</option>
                                                <option value="semi_furnished">Semi Furnished</option>
                                                <option value="unfurnished">Unfurnished</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea name="description" rows="4" value={formData.description} onChange={handleInputChange}
                                            placeholder="Describe your property in detail..." className="form-control modern"></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Status & SEO */}
                            <div className="form-section">
                                <div className="section-header">
                                    <div className="section-icon"><i className="bi bi-gear"></i></div>
                                    <div>
                                        <h3 className="section-title">Status & SEO</h3>
                                        <p className="section-subtitle">Property status and search engine optimization</p>
                                    </div>
                                </div>

                                <div className="section-content">
                                    <div className="form-group">
                                        <label>Property Status</label>
                                        <select name="status" value={formData.status} onChange={handleInputChange} className="form-control modern">
                                            <option value="available">Available</option>
                                            <option value="sold">Sold</option>
                                            <option value="rented">Rented</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Slug / URL</label>
                                        <input type="text" name="slug" value={formData.slug} onChange={handleInputChange}
                                            placeholder="auto-generated-from-title" className="form-control modern" />
                                        <small className="help-text">Leave empty to auto-generate from title</small>
                                    </div>

                                    <div className={`premium-feature-card ${formData.instalment_available ? 'active' : ''}`}>
                                        <div className="feature-card-header">
                                            <div className="feature-icon-wrapper">
                                                <i className="bi bi-piggy-bank"></i>
                                            </div>
                                            <div className="feature-title-wrapper">
                                                <h3>Flexible Payment Options</h3>
                                                <p>Offer instalment plans to attract more buyers</p>
                                            </div>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    name="instalment_available"
                                                    checked={formData.instalment_available}
                                                    onChange={handleInputChange}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>

                                        {formData.instalment_available && (
                                            <div className="feature-benefits">
                                                <div className="benefit-item">
                                                    <i className="bi bi-check-lg"></i>
                                                    <span>Increase buyer affordability</span>
                                                </div>
                                                <div className="benefit-item">
                                                    <i className="bi bi-check-lg"></i>
                                                    <span>Faster property sales</span>
                                                </div>
                                                <div className="benefit-item">
                                                    <i className="bi bi-check-lg"></i>
                                                    <span>Competitive advantage</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {showInstalment && (
                            <div className="form-section instalment-section">
                                <div className="section-header">
                                    <div className="section-icon"><i className="bi bi-calendar-check"></i></div>
                                    <div>
                                        <h3 className="section-title">Instalment Plan</h3>
                                        <p className="section-subtitle">Configure the instalment payment options</p>
                                    </div>
                                </div>

                                <div className="section-content">
                                    <div className="instalment-summary">
                                        <div className="summary-card">
                                            <span className="summary-label">Total Price</span>
                                            <span className="summary-value">${parseInt(formData.price || 0).toLocaleString()}</span>
                                        </div>
                                        {formData.down_payment && (
                                            <div className="summary-card">
                                                <span className="summary-label">Down Payment</span>
                                                <span className="summary-value">${parseInt(formData.down_payment).toLocaleString()}</span>
                                            </div>
                                        )}
                                        {formData.monthly_installment && (
                                            <div className="summary-card">
                                                <span className="summary-label">Monthly Payment</span>
                                                <span className="summary-value">${parseInt(formData.monthly_installment).toLocaleString()}</span>
                                            </div>
                                        )}
                                        {formData.down_payment && formData.installment_years && (
                                            <div className="summary-card total-payment">
                                                <span className="summary-label">Total Payment</span>
                                                <span className="summary-value">${calculateTotalPayment().toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-row two-columns">
                                        <div className="form-group">
                                            <label>Down Payment (%)</label>
                                            <div className="input-group-modern">
                                                <input
                                                    type="number"
                                                    name="down_payment_percent"
                                                    value={downPaymentPercent}
                                                    onChange={handleDownPaymentPercentChange}
                                                    placeholder="e.g., 20"
                                                    className="form-control modern"
                                                    step="0.5"
                                                    min="0"
                                                    max="100"
                                                />
                                                <span className="suffix">%</span>
                                            </div>
                                            <small className="help-text">Percentage of total price</small>
                                        </div>
                                        <div className="form-group">
                                            <label>Down Payment Amount</label>
                                            <div className="input-group-modern">
                                                <span className="currency">$</span>
                                                <input
                                                    type="number"
                                                    name="down_payment"
                                                    value={formData.down_payment}
                                                    onChange={handleDownPaymentAmountChange}
                                                    placeholder="Down payment amount"
                                                    className="form-control modern"
                                                    step="1000"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-row two-columns">
                                        <div className="form-group">
                                            <label>Installment Period (Years)</label>
                                            <select
                                                name="installment_years"
                                                value={formData.installment_years}
                                                onChange={handleInstallmentChange}
                                                className="form-control modern"
                                            >
                                                <option value="">Select duration</option>
                                                <option value="3">3 Years (36 months)</option>
                                                <option value="5">5 Years (60 months)</option>
                                                <option value="10">10 Years (120 months)</option>
                                                <option value="15">15 Years (180 months)</option>
                                                <option value="20">20 Years (240 months)</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Interest Rate (%) per year</label>
                                            <div className="input-group-modern">
                                                <input
                                                    type="number"
                                                    name="interest_rate"
                                                    value={formData.interest_rate || 0}
                                                    onChange={handleInputChange}
                                                    placeholder="Interest rate"
                                                    className="form-control modern"
                                                    step="0.1"
                                                    min="0"
                                                />
                                                <span className="suffix">%</span>
                                            </div>
                                            <small className="help-text">Optional: Add interest rate for more accurate calculation</small>
                                        </div>
                                    </div>

                                    <div className="form-row two-columns">
                                        <div className="form-group">
                                            <label>Monthly Installment (Auto-calculated)</label>
                                            <div className="input-group-modern">
                                                <span className="currency">$</span>
                                                <input
                                                    type="number"
                                                    name="monthly_installment"
                                                    value={formData.monthly_installment}
                                                    onChange={handleInputChange}
                                                    placeholder="Auto-calculated"
                                                    className="form-control modern calculated"
                                                    readOnly
                                                    style={{ backgroundColor: '#f8fafc', cursor: 'not-allowed' }}
                                                />
                                            </div>
                                            <small className="help-text">Automatically calculated based on down payment and tenure</small>
                                        </div>
                                        <div className="form-group">
                                            <label>Processing Fee</label>
                                            <div className="input-group-modern">
                                                <span className="currency">$</span>
                                                <input
                                                    type="number"
                                                    name="processing_fee"
                                                    value={formData.processing_fee}
                                                    onChange={handleInputChange}
                                                    placeholder="Processing fee"
                                                    className="form-control modern"
                                                    step="100"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Late Payment Fee</label>
                                        <div className="input-group-modern">
                                            <span className="currency">$</span>
                                            <input
                                                type="number"
                                                name="late_payment_fee"
                                                value={formData.late_payment_fee}
                                                onChange={handleInputChange}
                                                placeholder="Late payment penalty"
                                                className="form-control modern"
                                                step="50"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Payment Breakdown Chart */}
                                    {(formData.down_payment > 0 || formData.monthly_installment > 0) && (
                                        <div className="payment-breakdown">
                                            <h4>Payment Breakdown</h4>
                                            <div className="breakdown-chart">
                                                <div className="breakdown-bar">
                                                    <div
                                                        className="breakdown-downpayment"
                                                        style={{ width: `${getDownPaymentPercentage()}%` }}
                                                    >
                                                        <span>Down Payment</span>
                                                    </div>
                                                    <div
                                                        className="breakdown-installment"
                                                        style={{ width: `${100 - getDownPaymentPercentage()}%` }}
                                                    >
                                                        <span>Installments</span>
                                                    </div>
                                                </div>
                                                <div className="breakdown-details">
                                                    <div className="detail-item">
                                                        <span className="detail-color downpayment"></span>
                                                        <span>Down Payment: ${parseInt(formData.down_payment || 0).toLocaleString()}</span>
                                                        <span className="detail-percent">({getDownPaymentPercentage()}%)</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="detail-color installment"></span>
                                                        <span>Total Installments: ${calculateTotalInstallments().toLocaleString()}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="detail-color interest"></span>
                                                        <span>Interest Amount: ${calculateInterestAmount().toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="instalment-note">
                                        <i className="bi bi-info-circle"></i>
                                        <span>Customer can choose between full payment or instalment plan based on these terms</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Location Information */}
                        <div className="form-section">
                            <div className="section-header">
                                <div className="section-icon"><i className="bi bi-geo-alt"></i></div>
                                <div>
                                    <h3 className="section-title">Location Information</h3>
                                    <p className="section-subtitle">Where is your property located?</p>
                                </div>
                            </div>

                            <div className="section-content">
                                <div className="form-group">
                                    <label>Full Address</label>
                                    <textarea name="address" rows="2" value={formData.address} onChange={handleInputChange}
                                        placeholder="Street address, building name, etc." className="form-control modern"></textarea>
                                </div>

                                <div className="form-row three-columns">
                                    <div className="form-group"><label>City</label><input type="text" name="city" value={formData.city}
                                        onChange={handleInputChange} placeholder="City" className="form-control modern" /></div>
                                    <div className="form-group"><label>State</label><input type="text" name="state" value={formData.state}
                                        onChange={handleInputChange} placeholder="State" className="form-control modern" /></div>
                                    <div className="form-group"><label>Country</label><input type="text" name="country" value={formData.country}
                                        onChange={handleInputChange} placeholder="Country" className="form-control modern" /></div>
                                </div>

                                <div className="form-row two-columns">
                                    <div className="form-group"><label>Latitude</label><input type="text" name="latitude" value={formData.latitude}
                                        onChange={handleInputChange} placeholder="Latitude" className="form-control modern" /></div>
                                    <div className="form-group"><label>Longitude</label><input type="text" name="longitude" value={formData.longitude}
                                        onChange={handleInputChange} placeholder="Longitude" className="form-control modern" /></div>
                                </div>
                            </div>
                        </div>

                        {/* Amenities - Card Style */}
                        <div className="form-section">
                            <div className="section-header">
                                <div className="section-icon"><i className="bi bi-star"></i></div>
                                <div>
                                    <h3 className="section-title">Amenities</h3>
                                    <p className="section-subtitle">Select the amenities available in your property</p>
                                </div>
                            </div>

                            <div className="amenities-grid">
                                {amunities.map(amenity => (
                                    <div key={amenity.id} className={`amenity-card ${formData.amenities.includes(amenity.id) ? 'selected' : ''}`}
                                        onClick={() => toggleSelection('amenities', amenity.id)}>
                                        <div className="amenity-icon">{amenity.icon || '✓'}</div>
                                        <div className="amenity-name">{amenity.name}</div>
                                        {formData.amenities.includes(amenity.id) && <div className="check-mark"><i className="bi bi-check-circle-fill"></i></div>}
                                    </div>
                                ))}
                            </div>
                            {formData.amenities.length > 0 && (
                                <div className="selected-count"><Badge bg="success">{formData.amenities.length} Amenities Selected</Badge></div>
                            )}
                        </div>

                        {/* Features - Card Style */}
                        <div className="form-section">
                            <div className="section-header">
                                <div className="section-icon"><i className="bi bi-gem"></i></div>
                                <div>
                                    <h3 className="section-title">Features</h3>
                                    <p className="section-subtitle">Special features that make your property unique</p>
                                </div>
                            </div>

                            <div className="features-grid">
                                {features.map(feature => (
                                    <div key={feature.id} className={`feature-card ${formData.features.includes(feature.id) ? 'selected' : ''}`}
                                        onClick={() => toggleSelection('features', feature.id)}>
                                        <div className="feature-icon">{feature.icon || '✨'}</div>
                                        <div className="feature-name">{feature.name}</div>
                                        {formData.features.includes(feature.id) && <div className="check-mark"><i className="bi bi-check-circle-fill"></i></div>}
                                    </div>
                                ))}
                            </div>
                            {formData.features.length > 0 && (
                                <div className="selected-count"><Badge bg="info">{formData.features.length} Features Selected</Badge></div>
                            )}
                        </div>

                        {/* Instalment Plan Section */}


                        {/* Gallery Section - Fixed with visible buttons */}
                        <div className="form-section gallery-section">
                            <div className="section-header">
                                <div className="section-icon"><i className="bi bi-images"></i></div>
                                <div>
                                    <h3 className="section-title">Property Gallery</h3>
                                    <p className="section-subtitle">Upload up to 10 images. Click the star to set primary image</p>
                                </div>
                            </div>

                            <div className="gallery-grid">
                                {previewUrls.images.map((img, idx) => (
                                    <div key={idx} className="gallery-card">
                                        <div className="gallery-image-wrapper">
                                            <img src={img} alt={`Property ${idx + 1}`} className="gallery-image" />
                                            {primaryImageIndex === idx && <div className="primary-badge"><i className="bi bi-star-fill"></i> Primary</div>}
                                        </div>
                                        <div className="gallery-card-actions">
                                            <button type="button" className="gallery-action-btn primary" onClick={() => handleSetPrimaryImage(idx)} title="Set as primary">
                                                <i className="bi bi-star"></i>
                                            </button>
                                            <button type="button" className="gallery-action-btn delete" onClick={() => handleRemoveImage('images', idx)} title="Remove image">
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {previewUrls.images.length < 10 && (
                                    <div className="gallery-card add-card" onClick={() => galleryInputRef.current.click()}>
                                        <div className="add-card-content">
                                            <i className="bi bi-plus-circle"></i>
                                            <p>Add Image</p>
                                            <span className="image-count">{previewUrls.images.length}/10</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <input ref={galleryInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                                onChange={(e) => {
                                    const files = Array.from(e.target.files);
                                    const remainingSlots = 10 - previewUrls.images.length;
                                    const filesToUpload = files.slice(0, remainingSlots);
                                    if (filesToUpload.length < files.length) {
                                        showErrorToast(`Maximum 10 images allowed. Only ${remainingSlots} more can be added.`);
                                    }
                                    filesToUpload.forEach(file => {
                                        handleFileSelect({ target: { files: [file] } }, {
                                            name: 'images', type: 'file-multiple',
                                            cropOptions: { width: 800, height: 600, aspect: 4 / 3 }
                                        });
                                    });
                                    e.target.value = null;
                                }} />

                            {uploadingImages && <div className="uploading-indicator"><Spinner animation="border" size="sm" /> Processing images...</div>}
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={() => navigate('/admin/properties')}>
                                <i className="bi bi-x-circle"></i> Cancel
                            </button>
                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? <><Spinner as="span" animation="border" size="sm" /> Processing...</> : <><i className="bi bi-check-circle"></i> {isEditMode ? "Update Property" : "Create Property"}</>}
                            </button>
                        </div>
                    </Form>
                </div>
            </div>

            <ImageCropModal show={cropModal} onHide={() => setCropModal(false)} imageSrc={cropImage}
                onCropComplete={handleCropComplete} cropOptions={cropOptions} circularCrop={false} />
        </>
    );
};

export default PropertyForm;
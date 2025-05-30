import { useTranslation } from 'react-i18next';

const productCategory = [
    { id: 1, label: "Smartphones", value: "smartphones" },
    { id: 2, label: "Headphones", value: "headphones" },
    { id: 3, label: "Smartwatches", value: "smartwatches" },
    { id: 4, label: "Laptops", value: "laptops" },
    { id: 5, label: "Monitors", value: "monitors" },
    { id: 6, label: "Computers", value: "computers" },
    { id: 7, label: "TVs", value: "televisions" },
    { id: 8, label: "Refrigerators", value: "refrigerators" },
    { id: 9, label: "Washing Machines", value: "washing-machines" },
    { id: 10, label: "Dryers", value: "dryers" },
    { id: 11, label: "Dishwashers", value: "dishwashers" },
    { id: 12, label: "Vacuum Cleaners", value: "vacuum-cleaners" },
    { id: 13, label: "Coffee Machines", value: "coffee-machines" },
    { id: 14, label: "Microwave Ovens", value: "microwave-ovens" },
    { id: 15, label: "Cameras", value: "cameras" },
    { id: 16, label: "Printers", value: "printers" },
    { id: 17, label: "Processors", value: "processors" },
    { id: 18, label: "Speakers", value: "speakers" },
    { id: 19, label: "Hearphones", value: "hearphones" },
    { id: 20, label: "Mouse", value: "mouse" }
];

export const useTranslatedCategories = () => {
    const { t } = useTranslation();
    return productCategory.map(category => ({
        ...category,
        label: t(`categories.${category.label}`)
    }));
};

export default productCategory;
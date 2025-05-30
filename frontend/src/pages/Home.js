import React from 'react';
import { useTranslation } from 'react-i18next';
import CategoryList from '../components/CategoryList';
import BannerProduct from '../components/BannerProduct';
import VerticalCardProduct from '../components/VerticalCardProduct';

const Home = () => {
    const { t } = useTranslation();

    return (
        <div className='container mx-auto px-4'>
            {/* Conținut principal cu spațiere adecvată */}
            <div className='pt-24 pb-6'>
                {/** Banner promoțional */}
                <div className='mb-8 relative z-0'>
                    <BannerProduct />
                </div>
                
                {/** Secțiune text promoțional cu margin-bottom redus */}
                <div className='text-center mb-2'>
                    <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
                        {t('home.title')}
                    </h1>
                </div>
                
                {/** Listă categorii - acum mai aproape de heading */}
                <CategoryList />

                {/** Produse pe categorii - fără heading-uri vizibile */}
                <div className='space-y-8 mt-8'>
                    <VerticalCardProduct category={"smartphones"} heading={""} />
                    <VerticalCardProduct category={"headphones"} heading={""} />
                    <VerticalCardProduct category={"smartwatches"} heading={""} />
                    <VerticalCardProduct category={"laptops"} heading={""} />
                    <VerticalCardProduct category={"monitors"} heading={""} />
                    <VerticalCardProduct category={"computers"} heading={""} />
                    <VerticalCardProduct category={"televisions"} heading={""} />
                    <VerticalCardProduct category={"refrigerators"} heading={""} />
                    <VerticalCardProduct category={"washing-machines"} heading={""} />
                    <VerticalCardProduct category={"dryers"} heading={""} />
                    <VerticalCardProduct category={"dishwashers"} heading={""} />
                    <VerticalCardProduct category={"vacuum-cleaners"} heading={""} />
                    <VerticalCardProduct category={"coffee-machines"} heading={""} />
                    <VerticalCardProduct category={"microwave-ovens"} heading={""} />
                    <VerticalCardProduct category={"cameras"} heading={""} />
                    <VerticalCardProduct category={"printers"} heading={""} />
                    <VerticalCardProduct category={"processors"} heading={""} />
                    <VerticalCardProduct category={"speakers"} heading={""} />
                    <VerticalCardProduct category={"hearphones"} heading={""} />
                    <VerticalCardProduct category={"mouse"} heading={""} />
                </div>
            </div>
        </div>
    );
};

export default Home;
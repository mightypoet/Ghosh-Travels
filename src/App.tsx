import React from 'react';
import { Layout } from './components/Layout';
import { AppProvider, useApp } from './context/AppContext';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import {
  AboutPage,
  BlogPage,
  CareerPage,
  ContactPage,
  LegalPage,
  NotFoundPage,
} from './pages/CompanyAndLegalPages';
import { HomePage } from './pages/HomePage';
import {
  FleetPage,
  ServiceDetailPage,
  ServicesMainPage,
} from './pages/ServicesAndFleetPages';
import { BookCabPage, TariffPage } from './pages/TariffAndBookingPages';

const PageRouter: React.FC = () => {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'home':
      return <HomePage />;
    case 'about':
      return <AboutPage />;
    case 'services':
      return <ServicesMainPage />;
    case 'service-luxury-coach':
    case 'service-mini-bus':
    case 'service-corporate':
    case 'service-luxury-car':
    case 'service-premium-car':
    case 'service-wedding-car':
      return <ServiceDetailPage serviceId={currentPage} />;
    case 'fleet':
      return <FleetPage />;
    case 'tariff':
      return <TariffPage />;
    case 'booking':
      return <BookCabPage />;
    case 'contact':
      return <ContactPage />;
    case 'career':
      return <CareerPage />;
    case 'blog':
      return <BlogPage />;
    case 'terms':
      return <LegalPage pageType="terms" />;
    case 'privacy':
      return <LegalPage pageType="privacy" />;
    case 'disclaimer':
      return <LegalPage pageType="disclaimer" />;
    case 'refund':
      return <LegalPage pageType="refund" />;
    case 'admin':
      return <AdminDashboardPage />;
    default:
      return <NotFoundPage />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <PageRouter />
      </Layout>
    </AppProvider>
  );
}

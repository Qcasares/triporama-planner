import { useLocation } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { HomeIcon } from 'lucide-react';

export const NavigationBreadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center gap-2">
            <HomeIcon className="h-4 w-4" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.map((segment, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink href={`/${pathSegments.slice(0, index + 1).join('/')}`}>
              {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
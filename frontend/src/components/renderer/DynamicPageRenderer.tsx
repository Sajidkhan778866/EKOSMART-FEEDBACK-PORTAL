import React from 'react';
import { DynamicComponentRenderer, type IComponentConfig } from './DynamicComponentRenderer';

export interface ISectionConfig {
  id: string;
  name: string;
  type?: string;
  layout?: {
    width?: 'boxed' | 'full' | 'narrow';
    maxWidth?: string;
    columns?: number;
    gap?: string;
    alignItems?: 'start' | 'center' | 'end' | 'stretch';
    justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around';
  };
  styling?: {
    bgColor?: string;
    bgGradient?: string;
    bgImage?: string;
    bgOverlayOpacity?: number;
    paddingY?: string;
    paddingX?: string;
    marginY?: string;
    borderRadius?: string;
    border?: string;
    shadow?: string;
  };
  responsive?: {
    hideOnDesktop?: boolean;
    hideOnTablet?: boolean;
    hideOnMobile?: boolean;
    columnsTablet?: number;
    columnsMobile?: number;
  };
  components: IComponentConfig[];
  isVisible?: boolean;
  order?: number;
}

export const DynamicPageRenderer: React.FC<{ sections: ISectionConfig[] }> = ({ sections }) => {
  if (!sections || sections.length === 0) {
    return null;
  }

  const sortedSections = [...sections]
    .filter((s) => s.isVisible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6 md:space-y-8 w-full">
      {sortedSections.map((section) => {
        const { id, layout = {}, styling = {}, responsive = {}, components = [] } = section;

        // Container Width Constraint
        const widthClass =
          layout.width === 'full'
            ? 'w-full'
            : layout.width === 'narrow'
            ? 'max-w-3xl mx-auto px-4'
            : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

        // Responsive columns
        const cols = layout.columns || 1;
        const colClass =
          cols === 1
            ? 'grid-cols-1'
            : cols === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : cols === 3
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : cols === 4
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1 md:grid-cols-3';

        // Visibility classes
        const hideClasses = [
          responsive.hideOnMobile ? 'hidden sm:block' : '',
          responsive.hideOnTablet ? 'sm:hidden md:block' : '',
          responsive.hideOnDesktop ? 'lg:hidden' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <section
            key={id || Math.random().toString()}
            className={`transition-all ${hideClasses}`}
            style={{
              backgroundColor: styling.bgColor || 'transparent',
              backgroundImage: styling.bgGradient || (styling.bgImage ? `url(${styling.bgImage})` : undefined),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: styling.borderRadius,
              border: styling.border,
              boxShadow: styling.shadow,
              paddingTop: styling.paddingY,
              paddingBottom: styling.paddingY,
              paddingLeft: styling.paddingX,
              paddingRight: styling.paddingX,
              marginTop: styling.marginY,
              marginBottom: styling.marginY,
            }}
          >
            <div className={widthClass}>
              <div
                className={`grid ${colClass}`}
                style={{
                  gap: layout.gap || '1.5rem',
                  alignItems: layout.alignItems || 'stretch',
                }}
              >
                {components.map((comp) => (
                  <div key={comp.id || Math.random().toString()} className="w-full">
                    <DynamicComponentRenderer component={comp} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

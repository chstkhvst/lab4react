import React, { useContext, useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import REObjectList from '../REObjectList';
import { REObjectContext } from '../../context/REObjectContext';
import { Link } from 'react-router-dom';

const ObjectsPageForUsers: React.FC = () => {
  const context = useContext(REObjectContext);
   const [currentFilters, setCurrentFilters] = useState<{
      objectTypeId?: number;
      dealTypeId?: number;
      statusId?: number;
    }>({});

  if (!context) {
    return <Typography>Контекст не найден</Typography>;
  }
  const { reobjects, fetchFilteredObjects,
    fetchPaginatedObjects,
    currentPage,
    totalPages,
    pageSize,
    totalCount
   } = context;
   const handleFilterChange = async (filters: {
    objectTypeId?: number;
    dealTypeId?: number;
    statusId?: number;
  }) => {
    setCurrentFilters(filters);
    await fetchFilteredObjects(filters, 1); // Всегда первая страница при фильтрации
  };

  const handlePageChange = async (page: number) => {
    await fetchFilteredObjects(currentFilters, page); // Повторяем текущие фильтры
  };
  //const { reobjects } = context; // Берем только reobjects

  return (
<Box sx={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url(/nedviga.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      py: 6
    }}>
      <Container>
        <Box sx={{
          backgroundColor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 3
        }}>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              mb: 4
            }}
          >
            Объекты недвижимости
          </Typography>
          <REObjectList objects={reobjects} 
            objectTypes={context.objectTypes}
            dealTypes={context.dealTypes}
            onFilterChange={handleFilterChange}

            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={fetchPaginatedObjects}
            pageSize={pageSize}
          />
        </Box>
      </Container>
      </Box>
  );
};

export default ObjectsPageForUsers;

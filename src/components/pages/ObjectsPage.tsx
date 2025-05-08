// import React, { useContext } from 'react';
// import { Container, Typography, Button, Box } from '@mui/material';
// import REObjectList from '../REObjectList';
// import { REObjectContext } from '../../context/REObjectContext';
// import { useAuth, UserRole } from '../../context/AuthContext';
// import { useNavigate } from "react-router-dom";
// import AddIcon from '@mui/icons-material/Add';

// const ObjectPage: React.FC = () => {
//   const context = useContext(REObjectContext);
//   const { user, isAdmin } = useAuth();
//   const navigate = useNavigate()

//   if (!context) {
//     return <Typography>Контекст не найден</Typography>;
//   }

//   const { reobjects, deleteREObject, fetchFilteredObjects,
//     fetchPaginatedObjects,
//     currentPage,
//     totalPages,
//     pageSize,
//     totalCount } = context;
//   const handleFilterChange = async (filters: {
//     objectTypeId?: number;
//     dealTypeId?: number;
//     statusId?: number;
//   }) => {
//     await fetchFilteredObjects(filters);
//   };

//   return (
//     <Box sx={{
//       backgroundImage: 'linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url(/nedviga.jpg)',
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//       minHeight: '100vh',
//       py: 6
//     }}>
//       <Container>
//         <Box sx={{
//           backgroundColor: 'background.paper',
//           p: 4,
//           borderRadius: 2,
//           boxShadow: 3
//         }}>
//           <Typography variant="h4" gutterBottom>
//             Список объектов недвижимости
//           </Typography>
//           <Button 
//             variant="contained" 
//             onClick={() => navigate("/objects/add")}
//             sx={{ mb: 4 }}
//             startIcon={<AddIcon />}
//           >
//             Добавить новый объект
//           </Button>
//           <REObjectList 
//             objects={reobjects} 
//             onDelete={deleteREObject} 
//             objectTypes={context.objectTypes}
//             dealTypes={context.dealTypes}
//             statuses={context.statuses}
//             onFilterChange={handleFilterChange}

//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={fetchPaginatedObjects}
//             pageSize={pageSize}
//           />
          
//         </Box>
//       </Container>
//     </Box>
//   );

// };

// export default ObjectPage;
import React, { useContext, useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import REObjectList from '../REObjectList';
import { REObjectContext } from '../../context/REObjectContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

const ObjectPage: React.FC = () => {
  const context = useContext(REObjectContext);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [currentFilters, setCurrentFilters] = useState<{
    objectTypeId?: number;
    dealTypeId?: number;
    statusId?: number;
  }>({});

  if (!context) {
    return <Typography>Контекст не найден</Typography>;
  }

  const {
    reobjects,
    deleteREObject,
    fetchFilteredObjects,
    fetchPaginatedObjects,
    currentPage,
    totalPages,
    pageSize,
    totalCount,
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
          <Typography variant="h4" gutterBottom>
            Список объектов недвижимости
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate("/objects/add")}
            sx={{ mb: 4 }}
            startIcon={<AddIcon />}
          >
            Добавить новый объект
          </Button>
          <REObjectList 
            objects={reobjects} 
            onDelete={deleteREObject} 
            objectTypes={context.objectTypes}
            dealTypes={context.dealTypes}
            statuses={context.statuses}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default ObjectPage;

import { useState, useEffect } from 'react';

interface UserData {
  _id: string;
  Name: string;
  Email: string;
  Permission: string[];
  Hotel: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const usePermissions = () => {
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userDataStr = localStorage.getItem('userData');
    
    if (token && userDataStr) {
      try {
        const parsedUserData = JSON.parse(userDataStr);
        setUserData(parsedUserData);
        setUserPermissions(parsedUserData.Permission || []);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUserPermissions([]);
      }
    }
    
    setLoading(false);
  }, []);

  const hasPermission = (permission: string): boolean => {
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => userPermissions.includes(permission));
  };

  return {
    userPermissions,
    userData,
    loading,
    hasPermission,
    hasAnyPermission
  };
};
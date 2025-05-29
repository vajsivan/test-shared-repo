import {
    parseFromLocalStorage,
    setToLocalStorageStorage,
} from 'src/utils/local-storage';
import { Company, User } from 'src/types';
import { RecentlyViewedType } from './types';

export const useRecentlyViewedCompanies = (currentUser: User) => {
    const getRecentlyViewedCompanies = (): Company[] | [] => {
        if (!currentUser) {
            console.error('User not found');
            return [];
        }

        const recentlyViewed: RecentlyViewedType | null = parseFromLocalStorage(
            'recentlyViewedCompanies',
        );

        if (!recentlyViewed) return [];

        const userRecentlyViewed = recentlyViewed[currentUser.id];

        if (!userRecentlyViewed) return [];

        return userRecentlyViewed.companies;
    };

    const setRecentlyViewedCompany = (company: Company) => {
        if (!currentUser) {
            console.error('User not found');
            return;
        }

        const allRecentlyViewed: RecentlyViewedType =
            parseFromLocalStorage('recentlyViewedCompanies') || {};
        const userRecentlyViewedCompanies: Company[] =
            allRecentlyViewed[currentUser.id]?.companies || [];

        const existingIndex = userRecentlyViewedCompanies.findIndex(
            (c) => c.id === company.id,
        );

        if (existingIndex !== -1) {
            userRecentlyViewedCompanies.splice(existingIndex, 1);
        }

        userRecentlyViewedCompanies.unshift(company);

        allRecentlyViewed[currentUser.id] = {
            companies: userRecentlyViewedCompanies,
        };

        setToLocalStorageStorage(
            'recentlyViewedCompanies',
            JSON.stringify(allRecentlyViewed),
        );
    };

    return { getRecentlyViewedCompanies, setRecentlyViewedCompany };
};

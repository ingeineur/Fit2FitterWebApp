import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import FetchData from './components/FetchData';
import Dashboard from './components/Dashboard';
import DashboardDaily from './components/DashboardDaily';
import Activities from './components/Activities';
import Meals from './components/Meals';
import Macro from './components/Macro';
import MacroGuide from './components/MacroGuide';
import MacroGuideRecipes from './components/MacroGuideRecipes';
import MacroGuideSearch from './components/MacroGuideSearch';
import MacroHeader from './components/MacroHeader';
import ActivivtyHeader from './components/ActivityHeader';
import ActivivtyTable from './components/ActivityTable';
import Measurements from './components/Measurements';
import Personal from './components/Personal';
import EBook from './components/EBook';
import Admin from './components/Admin';
import AdminResetPwd from './components/AdminResetPwd';
import Logout from './components/Logout';
import Master from './components/Master';
import Messages from './components/Messages';
import MessagesMenus from './components/MessagesMenus';
import MessagesMeals from './components/MessagesMeals';
import MessagesMeasurements from './components/MessagesMeasurements';
import MessagesMealsAdmin from './components/MessagesMealsAdmin';
import MessagesMealsAdminByDate from './components/MessagesMealsAdminByDate';
import MessagesMeasurementsAdminByDate from './components/MessagesMeasurementsAdminByDate';

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/dashboarddaily' component={DashboardDaily} />
        <Route path='/activities' component={Activities} />
        <Route path='/meals' component={Meals} />
        <Route path='/macro' component={Macro} />
        <Route path='/macroheader' component={MacroHeader} />
        <Route path='/activityheader' component={ActivivtyHeader} />
        <Route path='/activitytable' component={ActivivtyTable} />
        <Route path='/measurements' component={Measurements} />
        <Route path='/personal' component={Personal} />
        <Route path='/ebook' component={EBook} />
        <Route path='/admin' component={Admin} />
        <Route path='/adminresetpwd' component={AdminResetPwd} />
        <Route path='/logout' component={Logout} />
        <Route path='/master' component={Master} />
        <Route path='/messages' component={Messages} />
        <Route path='/messagesmenus' component={MessagesMenus} />
        <Route path='/messagesmeals' component={MessagesMeals} />
        <Route path='/messagesmealsadmin' component={MessagesMealsAdmin} />
        <Route path='/messagesmealsadminbydate' component={MessagesMealsAdminByDate} />
        <Route path='/messagesmeasurementsadminbydate' component={MessagesMeasurementsAdminByDate} />
        <Route path='/messagesmeasurements' component={MessagesMeasurements} />
        <Route path='/macroguide' component={MacroGuide} />
        <Route path='/macroguiderecipes' component={MacroGuideRecipes} />
        <Route path='/macroguidesearch' component={MacroGuideSearch} />
        <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
    </Layout>
);

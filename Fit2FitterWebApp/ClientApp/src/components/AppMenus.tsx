import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Grid, Icon, Menu, Label, Image, Dimmer, Loader } from 'semantic-ui-react'
import { IClientDto, LoginDto } from '../models/clients';
import { IMessageDto } from '../models/messages';
import './signin.css';

interface IProps {
    clientDtos: IClientDto[];
    logins: LoginDto[];
    activeItem: string;
}

interface IState {
    activeItem: string;
    prevActiveItem: string;
    unReadMessage: number;
    unReadMessageMeals: number;
    unReadMessageMeasurements: number;
    messageDtos: IMessageDto[];
    messagesUpdated: boolean;
    messageMealsDtos: IMessageDto[];
    mealMessagesUpdated: boolean;
    messageMeasurementsDtos: IMessageDto[];
    measurementMessagesUpdated: boolean;
    toClientId: number;
    fetchAllData: boolean;
}

class AppMenus extends React.Component<IProps, IState > {

    fetchAllData = () => {
        fetch('api/tracker/' + this.props.logins[0].clientId + '/status/comments?readStatus=' + false)
            .then(response => response.json() as Promise<IMessageDto[]>)
            .then(data => this.setState({
                messageDtos: data, messagesUpdated: true, unReadMessage: data.length
            })).catch(error => console.log(error));

        fetch('api/tracker/' + this.props.logins[0].clientId + '/status/comments/meals?readStatus=' + false)
            .then(response => response.json() as Promise<IMessageDto[]>)
            .then(data => this.setState({
                messageMealsDtos: data, mealMessagesUpdated: true, unReadMessageMeals: data.length
            })).catch(error => console.log(error));

        var date = new Date();
        date.setHours(0, 0, 0, 0);
        fetch('api/tracker/' + this.props.logins[0].clientId + '/status/comments/measurements?dateString=' + date.toISOString() + '&readStatus=' + false)
            .then(response => response.json() as Promise<IMessageDto[]>)
            .then(data => this.setState({
                messageMeasurementsDtos: data, measurementMessagesUpdated: true, unReadMessageMeasurements: data.length
            })).catch(error => console.log(error));
    }

    public componentDidMount() {
    }

    constructor(props: IProps) {
        super(props);
        this.state = {
            activeItem: '',
            prevActiveItem: '',
            messageDtos: [],
            messagesUpdated: false,
            unReadMessage: 0,
            unReadMessageMeals: 0,
            toClientId: 2,
            messageMealsDtos: [],
            mealMessagesUpdated: false,
            messageMeasurementsDtos: [],
            measurementMessagesUpdated: false,
            unReadMessageMeasurements: 0,
            fetchAllData: false
        };
    }

    handleItemClick = (e: any, { name }: any) => {
        if (name == 'MessagesMain' && this.state.activeItem == 'MessagesMain') {
            this.setState({ activeItem: this.state.prevActiveItem, prevActiveItem: this.state.activeItem })
        }
        else if (name == 'Nutritions' && this.state.activeItem == 'Nutritions') {
            this.setState({ activeItem: this.state.prevActiveItem, prevActiveItem: this.state.activeItem })
        }
        else if (name == 'User' && this.state.activeItem == 'User') {
            this.setState({ activeItem: this.state.prevActiveItem, prevActiveItem: this.state.activeItem })
        }
        else {
            this.setState({ activeItem: name, prevActiveItem: this.state.activeItem })
        }
    }

    getAdmin = () => {
        if (this.props.logins[0].username === 'admin') {
            return (
                <Menu.Item
                    name='Master'
                    onClick={this.handleItemClick}>
                    <Icon color='olive' name='power' />
                    Master View
                    </Menu.Item>);
        }
    }

    getMealsReview = () => {
        if (this.props.logins[0].username === 'admin') {
            return (
                <Menu.Item
                    name='Meals Logger (Admin)'
                    disabled={this.isMenuDisable('Meals Logger (Admin)')}
                    onClick={this.handleItemClick}>
                    <Icon name='mail outline' color={this.getIconColor('Meals Logger (Admin)')} />
                    Meals
                    <Label color='red' floating>
                        {this.state.unReadMessageMeals}
                    </Label>
                    </Menu.Item>);
        }

        return (
            <Menu.Item
                name='Meals Logger'
                disabled={this.isMenuDisable('Meals Logger')}
                onClick={this.handleItemClick}>
                <Icon name='mail outline' color={this.getIconColor('Meals Logger')} />
                Meals
                <Label color='red' floating>
                    {this.state.unReadMessageMeals}
                </Label>
                </Menu.Item>
        );
    }

    getMeasurementsReview = () => {
        if (this.props.logins[0].username === 'admin') {
            return (
                <Menu.Item
                    name='Measurements Logger Admin'
                    disabled={this.isMenuDisable('Measurements Logger Admin')}
                    onClick={this.handleItemClick}>
                    <Icon name='mail outline' color={this.getIconColor('Measurements Logger Admin')}/>
                    Measure
                    <Label color='red' floating>
                        {this.state.unReadMessageMeasurements}
                    </Label>
                    </Menu.Item>);
        }

        return (
            <Menu.Item
                name='Measurements Logger'
                disabled={this.isMenuDisable('Measurements Logger')}
                onClick={this.handleItemClick}>
                <Icon name='mail outline' color={this.getIconColor('Measurements Logger')}/>
                Measure
                <Label color='red' floating>
                    {this.state.unReadMessageMeasurements}
                </Label>
                </Menu.Item>
        );
    }

    getMealsReviewByDate = () => {
        if (this.props.logins[0].username === 'admin') {
            return (
                <Menu.Item
                    name='Meals Logger by Date (Admin)'
                    disabled={this.isMenuDisable('Meals Logger by Date (Admin)')}
                    onClick={this.handleItemClick}>
                    <Icon name='mail outline' color={this.getIconColor('Meals Logger by Date (Admin)')} />
                        Meals by Date
                    <Label color='red' floating>
                        {this.state.unReadMessageMeals}
                    </Label>
                </Menu.Item>);
        }
    }

    getUserInfo = () => {
        if (this.props.clientDtos.length > 0) {
            var name = this.props.clientDtos[0].firstName;
            var lastSeen = new Date(this.props.logins[0].lastLogin);
            return name + ', last login: ' + lastSeen.toLocaleDateString();
        }
    }

    getPhoto = () => {
        if (this.props.clientDtos.length > 0) {
            var img = this.props.clientDtos[0].avatar;
            if (img != '') {
                return '/images/avatars/' + img;
            }
            else {
                return 'https://react.semantic-ui.com/images/avatar/small/rachel.png';
            }
        }
    }

    getInfoRow = () => {
        if (this.props.clientDtos.length > 0) {
            return (<Grid.Row>
                <Grid.Column textAlign='right'>
                    <Image avatar src={this.getPhoto()} />
                    <a>{this.getUserInfo()}</a>
                </Grid.Column>
            </Grid.Row>);
        }
    }

    isMenuDisable = (name: string) => {
        return (this.props.activeItem === name);
    }

    getIconColor = (name: string) => {
        if (name === 'Nutritions') {
            if (this.props.activeItem === 'New Meal' ||
                this.props.activeItem === 'CreateRecipes' ||
                this.props.activeItem === 'Macro Details' ||
                this.props.activeItem === 'Nutrients Lookup') {
                return 'orange';
            }
        }
        else if (name === 'User') {
            if (this.props.activeItem === 'Update Password') {
                return 'orange';
            }
        }
        else if (name === 'MessagesMain') {
            if (this.props.activeItem === 'Messages' ||
                this.props.activeItem === 'Meals Logger (Admin)' ||
                this.props.activeItem === 'Meals Logger' ||
                this.props.activeItem === 'Meals Logger by Date (Admin)' ||
                this.props.activeItem === 'Measurements Logger (Admin)' ||
                this.props.activeItem === 'Measurements Logger') {
                return 'orange';
            }
        }
        else if (this.props.activeItem === name) {
            return 'orange';
        }

        return 'blue';
    }

    getMessagesMenus = () => {
        if (this.state.activeItem === 'MessagesMain') {
            return (<Menu fluid widths={4} icon='labeled'>
                <Menu.Item
                    name='Messages'
                    disabled={this.isMenuDisable('Messages')}
                    onClick={this.handleItemClick}>
                    <Icon name='mail outline' color={this.getIconColor('Messages')} />
                        General
                        <Label color='red' floating>
                        {this.state.unReadMessage}
                    </Label>
                </Menu.Item>
                {this.getMealsReview()}
                {this.getMealsReviewByDate()}
                {this.getMeasurementsReview()}
            </Menu>);
        }
    }

    getMealsMenus = () => {
        if (this.state.activeItem === 'Nutritions') {
            return (<Menu fluid widths={4} icon='labeled'>
                <Menu.Item
                    name='New Meal'
                    disabled={this.isMenuDisable('New Meal')}
                    onClick={this.handleItemClick}>
                    <Icon name='edit outline' color={this.getIconColor('New Meal')} />
                    Daily Macros
                </Menu.Item>
                <Menu.Item
                    name='Macro Details'
                    disabled={this.isMenuDisable('Macro Details')}
                    onClick={this.handleItemClick}>
                    <Icon name='weight' color={this.getIconColor('Macro Details')} />
                    Macro Details
                </Menu.Item>
                <Menu.Item
                    name='CreateRecipes'
                    disabled={this.isMenuDisable('CreateRecipes')}
                    onClick={this.handleItemClick}>
                    <Icon name='edit outline' color={this.getIconColor('CreateRecipes')} />
                    Recipes
                </Menu.Item>
                <Menu.Item
                    name='Nutrients Lookup'
                    disabled={this.isMenuDisable('Nutrients Lookup')}
                    onClick={this.handleItemClick}>
                    <Icon name='search' color={this.getIconColor('Nutrients Lookup')} />
                    Nutrients Lookup 
                </Menu.Item>
            </Menu>);
        }
    }

    getUserMenus = () => {
        if (this.state.activeItem === 'User') {
            return (<Menu fluid widths={2} icon='labeled'>
                <Menu.Item
                    name='Update Password'
                    disabled={this.isMenuDisable('Update Password')}
                    onClick={this.handleItemClick}>
                    <Icon name='keyboard' color={this.getIconColor('Update Password')} />
                    Update Password
                </Menu.Item>
            </Menu>);
        }
    }

    render() {
        var divLoaderStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        if (!this.state.fetchAllData) {
            this.fetchAllData();
            this.setState({ fetchAllData: true });
        }

        if (!this.state.messagesUpdated ||
            !this.state.mealMessagesUpdated ||
            !this.state.measurementMessagesUpdated) {
            return (<div style={divLoaderStyle}>
                <Dimmer active inverted>
                    <Loader/>
                </Dimmer>
            </div>);
        }

        if (this.state.activeItem === 'Master') {
            return (<Redirect to="/master" />);
        }

        if (this.state.activeItem === 'Macro') {
            return (<Redirect to="/personal" />);
        }

        if (this.state.activeItem === 'Body') {
            return (<Redirect to="/measurements" />);
        }

        if (this.state.activeItem === 'New Meal') {
            return (<Redirect to="/macroguide" />);
        }

        if (this.state.activeItem === 'Activity') {
            return (<Redirect to="/activities" />);
        }

        if (this.state.activeItem === 'Dashboard') {
            return (<Redirect to="/dashboard" />);
        }

        if (this.state.activeItem === 'EBook') {
            return (<Redirect to="/ebook" />);
        }

        if (this.state.activeItem === 'Update Password') {
            return (<Redirect to="/admin" />);
        }

        if (this.state.activeItem === 'Macro Details') {
            return (<Redirect to="/personal" />);
        }

        if (this.state.activeItem === 'Logout') {
            return (<Redirect to="/logout" />);
        }

        if (this.state.activeItem === 'Messages') {
            return (<Redirect to="/messages" />);
        }

        if (this.state.activeItem === 'Meals Logger') {
            return (<Redirect to="/messagesmeals" />);
        }

        if (this.state.activeItem === 'Meals Logger (Admin)') {
            return (<Redirect to="/messagesmealsadmin" />);
        }

        if (this.state.activeItem === 'Meals Logger by Date (Admin)') {
            return (<Redirect to="/messagesmealsadminbydate" />);
        }

        if (this.state.activeItem === 'Measurements Logger') {
            return (<Redirect to="/messagesmeasurements" />);
        }

        if (this.state.activeItem === 'Measurements Logger Admin') {
            return (<Redirect to="/messagesmeasurementsadminbydate" />);
        }

        if (this.state.activeItem === 'CreateRecipes') {
            return (<Redirect to="/macroguiderecipes" />);
        }

        if (this.state.activeItem === 'Nutrients Lookup') {
            return (<Redirect to="/macroguidesearch" />);
        }

        return (
            <div>
                <Menu fluid widths={7} icon='labeled'>
                    <Menu.Item
                        name='Nutritions'
                        disabled={this.isMenuDisable('Nutritions')}
                        onClick={this.handleItemClick}>
                        <Icon name='food' color={this.getIconColor('Nutritions')} />
                        <a className="text-app-menu">Nutritions</a>
                    </Menu.Item>
                    <Menu.Item
                        name='Activity'
                        disabled={this.isMenuDisable('Activity')}
                        onClick={this.handleItemClick}>
                        <Icon name='child' color={this.getIconColor('Activity')} />
                        <a className="text-app-menu">Activity</a>
                    </Menu.Item>
                    <Menu.Item
                        name='Body'
                        disabled={this.isMenuDisable('Body')}
                        onClick={this.handleItemClick}>
                        <Icon name='calculator' color={this.getIconColor('Body')} />
                        <a className="text-app-menu">Measure</a>
                    </Menu.Item>
                    <Menu.Item
                        name='Dashboard'
                        disabled={this.isMenuDisable('Dashboard')}
                        onClick={this.handleItemClick}>
                        <Icon name='chart bar' color={this.getIconColor('Dashboard')} />
                        <a className="text-app-menu">Reports</a>
                    </Menu.Item>
                    <Menu.Item
                        name='MessagesMain'
                        disabled={this.isMenuDisable('MessagesMain')}
                        onClick={this.handleItemClick}>
                        <Icon name='mail' color={this.getIconColor('MessagesMain')} />
                        <a className="text-app-menu">Msg</a>
                        <Label color='red' floating>
                            {this.state.unReadMessage + this.state.unReadMessageMeals + this.state.unReadMessageMeasurements}
                        </Label>
                    </Menu.Item>
                    <Menu.Item
                        name='User'
                        disabled={this.isMenuDisable('User')}
                        onClick={this.handleItemClick}>
                        <Icon name='user' color={this.getIconColor('User')} />
                        <a className="text-app-menu">User</a>
                    </Menu.Item>
                    <Menu.Item
                        name='Logout'
                        disabled={this.isMenuDisable('Logout')}
                        onClick={this.handleItemClick}>
                        <Icon name='log out' color={this.getIconColor('Logout')} />
                        <a className="text-app-menu">Exit</a>
                    </Menu.Item>
                </Menu>
                {this.getMessagesMenus()}
                {this.getMealsMenus()}
                {this.getUserMenus()}
            </div>);
    }
}

export default connect()(AppMenus);

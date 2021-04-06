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
        else if (name == 'FoodsDB' && this.state.activeItem == 'FoodsDB') {
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
        if (this.props.activeItem === name) {
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

    getFoodsDBMenus = () => {
        if (this.state.activeItem === 'FoodsDB') {
            return (<Menu fluid widths={2} icon='labeled'>
                <Menu.Item
                    name='CreateRecipes'
                    disabled={this.isMenuDisable('CreateRecipes')}
                    onClick={this.handleItemClick}>
                    <Icon name='edit outline' color={this.getIconColor('CreateRecipes')} />
                    Create/Edit Recipes
                </Menu.Item>
                <Menu.Item
                    name='Nutrients Lookup'
                    disabled={this.isMenuDisable('Nutrients Lookup')}
                    onClick={this.handleItemClick}>
                    <Icon name='search' color={this.getIconColor('Nutrients Lookup')} />
                    Search Foods
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

        if (this.state.activeItem === 'Meal') {
            return (<Redirect to="/meals" />);
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

        if (this.state.activeItem === 'Admin') {
            return (<Redirect to="/admin" />);
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
                        name='New Meal'
                        disabled={this.isMenuDisable('New Meal')}
                        onClick={this.handleItemClick}>
                        <Icon name='food' color={this.getIconColor('New Meal')} />
                        Meals
                    </Menu.Item>
                    <Menu.Item
                        name='Activity'
                        disabled={this.isMenuDisable('Activity')}
                        onClick={this.handleItemClick}>
                        <Icon name='child' color={this.getIconColor('Activity')} />
                        Activity
                    </Menu.Item>
                    <Menu.Item
                        name='Body'
                        disabled={this.isMenuDisable('Body')}
                        onClick={this.handleItemClick}>
                        <Icon name='calculator' color={this.getIconColor('Body')} />
                        Measure
                    </Menu.Item>
                    <Menu.Item
                        name='Dashboard'
                        disabled={this.isMenuDisable('Dashboard')}
                        onClick={this.handleItemClick}>
                        <Icon name='chart bar' color={this.getIconColor('Dashboard')} />
                        Reports
                    </Menu.Item>
                    <Menu.Item
                        name='MessagesMain'
                        disabled={this.isMenuDisable('MessagesMain')}
                        onClick={this.handleItemClick}>
                        <Icon name='mail' color={this.getIconColor('MessagesMain')} />
                        Msg
                        <Label color='red' floating>
                            {this.state.unReadMessage + this.state.unReadMessageMeals + this.state.unReadMessageMeasurements}
                        </Label>
                    </Menu.Item>
                    <Menu.Item
                        name='FoodsDB'
                        disabled={this.isMenuDisable('FoodsDB')}
                        onClick={this.handleItemClick}>
                        <Icon name='database' color={this.getIconColor('FoodsDB')} />
                        Foods
                    </Menu.Item>
                    <Menu.Item
                        name='EBook'
                        disabled={this.isMenuDisable('EBook')}
                        onClick={this.handleItemClick}>
                        <Icon name='book' color={this.getIconColor('EBook')} />
                        EBook
                    </Menu.Item>
                </Menu>
                {this.getMessagesMenus()}
                {this.getFoodsDBMenus()}
            </div>);
    }
}

export default connect()(AppMenus);

import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Input, Grid, Message, Header, Segment, Loader, Dimmer } from 'semantic-ui-react';
import MacroGuideHeader from './MacroGuideHeader';
import MessagesMealsChat from './MessagesMealsChat';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import ActivityHeader from './ActivityHeader'
import CaloriesRemainingHeader from './CaloriesRemainingHeader'
import { IMacroGuides, IMealDto, IMeals, IMealDetails, IMacrosPlanDto } from '../models/meals'
import { IActivityGuides, IActivity, IActivityDto } from '../models/activities'
import { BarChart, Card, Text, Flex } from "@tremor/react";
import { isNull } from 'util';
import './signin.css';

interface IProps {
    update: boolean;
    clientId: number;
    senderId: number;
    mealDate: string;
}

interface IClientDto {
    id: number,
    lastName: string;
    firstName: string;
    address: string;
    city: string;
    age: number;
    created: string;
}

interface IState {
    meals: IMeals;
    dirty: boolean;
    clientId: number;
    mealDate: string;
    mealDtos: IMealDto[];
    apiUpdate: boolean;
    updated: boolean;
    macrosPlanDtos: IMacrosPlanDto[];
    clientDtos: IClientDto[];
    guides: IMacroGuides;
    breakfastImages: GalleryImage[];
    lunchImages: GalleryImage[];
    dinnerImages: GalleryImage[];
    snackImages: GalleryImage[];
    activityGuides: IActivityGuides;
    activities: IActivity[];
    activityDtos: IActivityDto[];
    steps: number;
    sleeps: number;
    mealsDownloaded: boolean;
    activitiesDownloaded: boolean;
}

interface GalleryImage {
    original: string,
    thumbnail: string,
    sizes: string
}

var divLabelStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    backgroundColor: 'black'
};

class MacroGuideReviewModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            dirty: false,
            meals: { 0: [], 1: [], 2: [], 3: [] },
            clientId: 0,
            mealDate: '',
            mealDtos: [],
            apiUpdate: false,
            updated: false,
            macrosPlanDtos: [],
            clientDtos: [],
            guides: { carb: 0, protein: 0, fat: 0, fruits: 0 },
            breakfastImages: [], lunchImages: [], dinnerImages: [], snackImages: [],
            activityGuides: { calories: 300, steps: 10000 },
            activities: [],
            activityDtos: [],
            sleeps: 0,
            steps: 0,
            mealsDownloaded: false,
            activitiesDownloaded: false
        };
    }

    public componentDidMount() {
        this.setState({ clientId: this.props.clientId, mealDate: this.props.mealDate });

        //get client info
        fetch('api/client?clientId=' + this.props.clientId)
            .then(response => response.json() as Promise<IClientDto[]>)
            .then(data => this.setState({
                clientDtos: data, apiUpdate: true
            })).catch(error => console.log(error));

        //get macros plan
        fetch('api/client/' + this.props.clientId + '/macrosplan')
            .then(response => response.json() as Promise<IMacrosPlanDto[]>)
            .then(data => this.setState({
                macrosPlanDtos: data, apiUpdate: true
            })).catch(error => console.log(error));

        //get all meals
        fetch('api/tracker/' + this.props.clientId + '/macrosguide?date=' + this.props.mealDate)
            .then(response => response.json() as Promise<IMealDto[]>)
            .then(data => this.setState({
                mealDtos: data, apiUpdate: true, updated: !this.state.updated, mealsDownloaded: true
            })).catch(error => console.log(error));

        //get all activities
        fetch('api/tracker/' + this.props.clientId + '/activity?date=' + this.props.mealDate)
            .then(response => response.json() as Promise<IActivityDto[]>)
            .then(data => this.setState({
                activityDtos: data, apiUpdate: true, activitiesDownloaded: true
            })).catch(error => console.log(error));
    }

    setActivities = () => {
        if (this.state.activityDtos.length > 0) {

            if ((this.state.activities.filter(x => x.id > 0)).length === this.state.activityDtos.length) {
                return;
            }

            var activities: IActivity[] = [];
            var steps: number = 0;
            var sleeps: number = 0.0;

            var index = this.state.activityDtos.findIndex(x => x.description === 'steps')
            if (index >= 0) {
                var stepsActivity = this.state.activityDtos[index];
                steps = stepsActivity.steps;
                activities.push({ id: stepsActivity.id, activityDesc: stepsActivity.description, calories: stepsActivity.calories, steps: stepsActivity.steps, maxHr: stepsActivity.maxHr, duration: stepsActivity.duration, check: false });
            }

            index = this.state.activityDtos.findIndex(x => x.description === 'sleeps')
            if (index >= 0) {
                var sleepsActivity = this.state.activityDtos[index];
                sleeps = sleepsActivity.duration;
                activities.push({ id: sleepsActivity.id, activityDesc: sleepsActivity.description, calories: sleepsActivity.calories, steps: sleepsActivity.steps, maxHr: sleepsActivity.maxHr, duration: sleepsActivity.duration, check: false });
            }

            this.state.activityDtos.forEach(activity => {
                if (activity.description !== 'sleeps' && activity.description !== 'steps') {
                    activities.push({ id: activity.id, activityDesc: activity.description, calories: activity.calories, steps: activity.steps, maxHr: activity.maxHr, duration: activity.duration, check: false });
                }
            })

            this.setState({ activities: activities, steps: steps, sleeps: sleeps });
        }
        else {
            var activities: IActivity[] = [];
            activities.push({ id: 0, activityDesc: 'steps', calories: 0, steps: 0, maxHr: 0, duration: 0.0, check: false });
            activities.push({ id: 0, activityDesc: 'sleeps', calories: 0, steps: 0, maxHr: 0, duration: 0.0, check: false });
            this.setState({ steps: 0, sleeps: 0.0, activities: activities });
        }
    }

    getActivityRows = () => {
        var arr = this.state.activities.filter(x => x.activityDesc != 'steps' && x.activityDesc != 'sleeps');
        return (
            arr.map((item, index) =>
                <Grid.Row textAlign='center' className={'row'} key={index} columns={3} stretched>
                    <Grid.Column className={'col_activity'} key={index + 1} width={8}>
                        <a className="text-table-row" key={index + 1}>{item.activityDesc}</a>
                    </Grid.Column>
                    <Grid.Column textAlign='center' className={'col_cal_burnt'} key={index + 5} width={4}>
                        <a className="text-table-row" key={index + 5}>{item.calories}</a>
                    </Grid.Column>
                    <Grid.Column textAlign='center' className={'col_max_hr'} key={index + 2} width={4}>
                        <a className="text-table-row" key={index + 2}>{item.maxHr}</a>
                    </Grid.Column>
                </Grid.Row>
            ));
    }

    getActivityDetails = () => {
        var arr = this.state.activities.filter(x => x.activityDesc != 'steps' && x.activityDesc != 'sleeps');
        if (arr.length == 0) {
            return (
                <Grid centered>
                    <Grid.Row color='black' textAlign='center' className={'row'} stretched>
                        <Grid.Column textAlign='center' className={'col_activity'}>
                            No Recorded Activities
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }
        return (
            <Grid centered>
                <Grid.Row color='black' className={'row'} columns={3} stretched>
                    <Grid.Column className={'col_activity'} width={8}>
                        <a className="text-table-row-light">Activity</a>
                    </Grid.Column>
                    <Grid.Column textAlign='center' className={'col_cal_burnt'} width={4}>
                        <a className="text-table-row-light">Calories</a>
                    </Grid.Column>
                    <Grid.Column textAlign='center' className={'col_max_hr'} width={4}>
                        <a className="text-table-row-light">Max HR</a>
                    </Grid.Column>
                </Grid.Row>
                {this.getActivityRows()}
            </Grid>
            );
    }

    getActivityLevel = (activityLevel: string) => {
        if (activityLevel == 'Sedentary') {
            return 1.2;
        }

        if (activityLevel == 'Lightly Active') {
            return 1.375;
        }

        if (activityLevel == 'Moderately Active') {
            return 1.55;
        }

        if (activityLevel == 'Very Active') {
            return 1.725;
        }

        if (activityLevel == 'Extra Active') {
            return 1.9;
        }

        return 0;
    }

    setMacroGuides = () => {
        if (this.state.macrosPlanDtos.length > 0 && this.state.clientDtos.length > 0) {
            const client = this.state.clientDtos[0];
            const macrosPlan = this.state.macrosPlanDtos[0];

            let carb = isNull(macrosPlan.carbWeight) ? '0.0' : macrosPlan.carbWeight.toString();
            let protein = isNull(macrosPlan.proteinWeight) ? '0.0' : macrosPlan.proteinWeight.toString();
            let fat = isNull(macrosPlan.fatWeight) ? '0.0' : macrosPlan.fatWeight.toString();

            if (isNull(macrosPlan.manual) || macrosPlan.manual === false) {
                const bmr = (10 * macrosPlan.weight) + (6.25 * macrosPlan.height) - (5 * client.age) - 161;
                const totalCalories = this.getActivityLevel(macrosPlan.activityLevel) * bmr;
                carb = ((macrosPlan.carbPercent / 100.0 * totalCalories) / 4).toFixed(2);
                protein = ((macrosPlan.proteinPercent / 100.0 * totalCalories) / 4).toFixed(2);
                fat = ((macrosPlan.fatPercent / 100.0 * totalCalories) / 9).toFixed(2);
            }

            var guides: IMacroGuides = { carb: 0, protein: 0, fat: 0, fruits: 0 }
            guides.carb = parseFloat(carb);
            guides.protein = parseFloat(protein);
            guides.fat = parseFloat(fat);
            guides.fruits = 4;

            return guides;
            //this.setState({ guides: this.state.guides });
        }
    }

    getMealTypeString = (type: number) => {
        if (type === 1) {
            return 'Lunch';
        }
        if (type === 2) {
            return 'Dinner';
        }
        if (type === 3) {
            return 'Snack';
        }

        return 'Breakfast';
    }

    getMealTypeIndex = (type: number) => {
        if (type == 1) {
            return 1;
        }
        if (type == 2) {
            return 2;
        }
        if (type == 3) {
            return 3;
        }

        return 0;
    }

    setMealGalleryImages = (mealType: number, meals: IMeals) => {
        let breakfastImages: GalleryImage[] = [];
        let lunchImages: GalleryImage[] = [];
        let dinnerImages: GalleryImage[] = [];
        let snackImages: GalleryImage[] = [];

        var arr = meals[this.getMealTypeIndex(mealType)].filter(x => x.remove !== true);
        arr.forEach(x => {
            if (mealType === 0 && x.photo !== '') {
                breakfastImages.push({
                    original: '/images/meals/' + x.photo,
                    thumbnail: '/images/meals/' + x.photo,
                    sizes: '(max-width: 400px) 400px, 100vw'
                });
            }
            else if (mealType === 1 && x.photo !== '') {
                lunchImages.push({
                    original: '/images/meals/' + x.photo,
                    thumbnail: '/images/meals/' + x.photo,
                    sizes: '(max-width: 400px) 400px, 100vw'
                });
            }
            else if (mealType === 2 && x.photo !== '') {
                dinnerImages.push({
                    original: '/images/meals/' + x.photo,
                    thumbnail: '/images/meals/' + x.photo,
                    sizes: '(max-width: 400px) 400px, 100vw'
                });
            }
            else if (mealType === 3 && x.photo !== '') {
                snackImages.push({
                    original: '/images/meals/' + x.photo,
                    thumbnail: '/images/meals/' + x.photo,
                    sizes: '(max-width: 400px) 400px, 100vw'
                });
            }
        });

        if (mealType === 0) {
            return breakfastImages;
            //this.setState({ breakfastImages: breakfastImages });
        }
        else if (mealType === 1) {
            return lunchImages;
            //this.setState({ lunchImages: lunchImages });
        }
        else if (mealType === 2) {
            return dinnerImages;
            //this.setState({ dinnerImages: dinnerImages });
        }
        else {
            return snackImages;
            //this.setState({ snackImages: snackImages });
        }
    }

    getMealGallery = (mealType: number) => {
        if (mealType === 0 && this.state.breakfastImages.length > 0) {
            return (
                <Grid.Row >
                    <Segment size='tiny'>
                        <ImageGallery items={this.state.breakfastImages} />                
                    </Segment>
                </Grid.Row>);
        }
        else if (mealType === 1 && this.state.lunchImages.length > 0) {
            return (
                <Grid.Row >
                    <Segment size='tiny'>
                        <ImageGallery items={this.state.lunchImages} />
                    </Segment>
                </Grid.Row>);
        }
        else if (mealType === 2 && this.state.dinnerImages.length > 0) {
            return (
                <Grid.Row >
                    <Segment size='tiny'>
                        <ImageGallery items={this.state.dinnerImages} />
                    </Segment>
                </Grid.Row>);
        }
        else if (mealType === 3 && this.state.snackImages.length > 0) {
            return (
                <Grid.Row >
                    <Segment size='tiny'>
                        <ImageGallery items={this.state.snackImages} />
                    </Segment>
                </Grid.Row>);
        }
    }

    getTotalCal = (food: IMealDetails) => {
        var carb = parseFloat(food.carb.toString());
        var protein = parseFloat(food.protein.toString());
        var fat = parseFloat(food.fat.toString());
        return carb * 4 + protein * 4 + fat * 9;
    }

    getTableRows = (mealType: number) => {
        var arr = this.state.meals[this.getMealTypeIndex(mealType)].filter(x => x.remove !== true);
        return (
            arr.map((item, index) =>
                <Grid.Row className={'row'} key={index} columns={5} stretched>
                    <Grid.Column className={'col_food'} key={index + 1} width={8}>
                        <a className="text-table-row" key={index + 1}>{item.food}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_portion'} key={index + 5} width={2}>
                        <a className="text-table-row" key={index + 5}>{this.getTotalCal(item).toFixed(0)}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_carb'} key={index + 2} width={2}>
                        <a className="text-table-row" key={index + 2}>{parseFloat(item.carb.toString()).toFixed(1)}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_protein'} key={index + 3} width={2}>
                        <a className="text-table-row" key={index + 3}>{parseFloat(item.protein.toString()).toFixed(1)}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_fat'} key={index + 4} width={2}>
                        <a className="text-table-row" key={index + 4}>{parseFloat(item.fat.toString()).toFixed(1)}</a>
                    </Grid.Column>
                </Grid.Row>
            ));
    }

    getRows = (mealType: number) => {
        var totalCarb = (this.state.meals[this.getMealTypeIndex(mealType)].reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
        var totalProtein = (this.state.meals[this.getMealTypeIndex(mealType)].reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
        var totalFat = (this.state.meals[this.getMealTypeIndex(mealType)].reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
        var totalCalories = totalCarb * 4 + totalProtein * 4 + totalFat * 9;
        return (
            <div>
                <Segment textAlign='center' attached='top'>
                    <Header as='h3'>
                        <Icon name='food' />
                        <Header.Content>{this.getMealTypeString(mealType)}</Header.Content>
                    </Header>
                </Segment>
                <Segment textAlign='center' attached='bottom'>
                    <Grid centered>
                        {this.getMealGallery(mealType)}
                        <Grid.Row columns={6} textAlign='left' color='grey'>
                            <Grid.Column width={2}>
                            </Grid.Column>
                            <Grid.Column width={6} textAlign='left'>
                                <div><a>Foods or Drinks</a></div>
                            </Grid.Column>
                            <Grid.Column width={2} textAlign='left'>
                                <div><a>Cal</a></div>
                            </Grid.Column>
                            <Grid.Column width={2} textAlign='left'>
                                <div><a>C(g)</a></div>
                            </Grid.Column>
                            <Grid.Column width={2} textAlign='left'>
                                <div><a>P(g)</a></div>
                            </Grid.Column>
                            <Grid.Column width={2} textAlign='left'>
                                <div><a>F(g)</a></div>
                            </Grid.Column>
                        </Grid.Row>
                        {this.getTableRows(mealType)}
                        <Grid.Row color='yellow' className={'row'} key={mealType + 1} columns={5} stretched>
                            <Grid.Column className={'col_food'} key={mealType + 1} width={8}>
                                <a className="text-table-row" key={mealType + 1}>Sub-Total Macros</a>
                            </Grid.Column>
                            <Grid.Column className={'col_portion'} key={mealType + 5} width={2}>
                                <a className="text-table-row" key={mealType + 5}>{totalCalories.toFixed(0)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_carb'} key={mealType + 2} width={2}>
                                <a className="text-table-row" key={mealType + 2}>{totalCarb.toFixed(1)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_protein'} key={mealType + 3} width={2}>
                                <a className="text-table-row" key={mealType + 3}>{totalProtein.toFixed(1)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_fat'} key={mealType + 4} width={2}>
                                <a className="text-table-row" key={mealType + 4}>{totalFat.toFixed(1)}</a>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
            );
    }

    getMealType = (type: string) => {
        if (type == 'Lunch') {
            return 1;
        }
        if (type == 'Dinner') {
            return 2;
        }
        if (type == 'Snack') {
            return 3;
        }

        return 0;
    }

    setMeals = () => {
        var meals: IMeals = { 0: [], 1: [], 2: [], 3: [] };
        if (this.state.mealDtos.length > 0) {

            var totalMeals = 0;
            for (let i = 0; i < 4; i++) {
                totalMeals += this.state.meals[this.getMealTypeIndex(i)].length;
            }

            //if (totalMeals === this.state.mealDtos.length) {
            //    return;
            //}

            this.state.mealDtos.forEach(meal => {
                meals[this.getMealType(meal.mealType)].push({ id: meal.id, food: meal.food, carb: meal.carb, protein: meal.protein, fat: meal.fat, portion: meal.portion, fv: meal.fv, photo: meal.photo, check: false, remove: false });
            })

            //this.setState({ meals: this.state.meals });
        }
        return meals;
    }

    getMeals = () => {
        if (this.state.clientId === 0 || this.state.mealDate.trim().length < 1) {
            return;
        }

        fetch('api/tracker/' + this.state.clientId + '/macrosguide?date=' + this.state.mealDate)
            .then(response => response.json() as Promise<IMealDto[]>)
            .then(data => {
                this.setState({
                    mealDtos: data, apiUpdate: true, mealsDownloaded: true
                });
            }).catch(error => console.log(error));
    }

    resetMeals = () => {
        this.setState({
            meals: { 0: [], 1: [], 2: [], 3: [] }, mealDtos: [] 
        });
    }

    isLoadingData = () => {
        if (this.state.clientDtos.length < 1 || this.state.macrosPlanDtos.length < 1 ||
            this.state.mealsDownloaded === false) {
            return true;
        }

        return false;
    }

    getActivities = () => {
        //get all activities
        fetch('api/tracker/' + this.props.clientId + '/activity?date=' + this.props.mealDate)
            .then(response => response.json() as Promise<IActivityDto[]>)
            .then(data => this.setState({
                activityDtos: data, apiUpdate: true, activitiesDownloaded: true
            })).catch(error => console.log(error));
    }

    render() {
        if (this.state.dirty !== this.props.update) {
            this.setState({ meals: { 0: [], 1: [], 2: [], 3: [] }, mealDtos: [], mealDate: this.props.mealDate, dirty: this.props.update, mealsDownloaded: false });
            this.getMeals();
            this.getActivities();
        }

        var divLoaderStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        if (this.isLoadingData()) {
            return (<div style={divLoaderStyle}>
                <Dimmer active inverted>
                    <Loader content='Loading'/>
                </Dimmer>
            </div>);
        }

        if (this.state.apiUpdate === true) {
            var guides = this.setMacroGuides();
            var iMeals = this.setMeals();
            var bImages = this.setMealGalleryImages(0, iMeals);
            var lImages = this.setMealGalleryImages(1, iMeals);
            var dImages = this.setMealGalleryImages(2, iMeals);
            var sImages = this.setMealGalleryImages(3, iMeals);
            this.setActivities();

            if (iMeals != null && guides != null) {
                this.setState({
                    meals: iMeals, guides: guides, breakfastImages: bImages,
                    lunchImages: lImages, dinnerImages: dImages, snackImages: sImages,
                    apiUpdate: false, updated: !this.state.updated
                });
            }
        }

        var age = 0;
        if (this.state.clientDtos.length > 0) {
            age = this.state.clientDtos[0].age;
        }

        var totalCarb: number = 0.0;
        var totalProtein: number = 0.0;
        var totalFat: number = 0.0;

        for (let i = 0; i < 4; i++) {
            totalCarb += (this.state.meals[this.getMealTypeIndex(i)].reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
            totalProtein += (this.state.meals[this.getMealTypeIndex(i)].reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
            totalFat += (this.state.meals[this.getMealTypeIndex(i)].reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
        }

        var data: any[] = [];
        data.push({ label: "macros", Carb: Math.round((totalCarb / this.state.guides.carb) * 100.0), Protein: Math.round((totalProtein / this.state.guides.protein) * 100.0), Fat: Math.round((totalFat / this.state.guides.fat) * 100.0) });

        var carbMacros: number[] = [];
        var proMacros: number[] = [];
        var fatMacros: number[] = [];

        var totalC: number = 0.0;
        var totalP: number = 0.0;
        var totalF: number = 0.0;

        var chartData2: any[] = [];

        for (let i = 0; i < 4; i++) {
            var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove !== true);
            totalC += (meals.reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
            totalP += (meals.reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
            totalF += (meals.reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
        }

        for (var i = 0; i < 4; i++) {
            if (i === 0) {
                var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove !== true);
                var totalCarb = (meals.reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
                var totalProtein = (meals.reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
                var totalFat = (meals.reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));

                carbMacros.push((totalCarb / totalC) * 100.0);
                proMacros.push((totalProtein / totalP) * 100.0);
                fatMacros.push((totalFat / totalF) * 100.0);

                chartData2.push({ label: "Breakfast", Carb: Math.round((totalCarb / totalC) * 100.0), Protein: Math.round((totalProtein / totalP) * 100.0), Fat: Math.round((totalFat / totalF) * 100.0) });
            }
            else if (i === 1) {
                var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove !== true);
                var totalCarb = (meals.reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
                var totalProtein = (meals.reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
                var totalFat = (meals.reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
                var totalVeg = (meals.reduce(function (a, b) { return a + parseFloat(b.fv.toString()) }, 0));

                carbMacros.push((totalCarb / totalC) * 100.0);
                proMacros.push((totalProtein / totalP) * 100.0);
                fatMacros.push((totalFat / totalF) * 100.0);

                chartData2.push({ label: "Lunch", Carb: Math.round((totalCarb / totalC) * 100.0), Protein: Math.round((totalProtein / totalP) * 100.0), Fat: Math.round((totalFat / totalF) * 100.0) });
            }
            else if (i === 2) {
                var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove !== true);
                var totalCarb = (meals.reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
                var totalProtein = (meals.reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
                var totalFat = (meals.reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
                var totalVeg = (meals.reduce(function (a, b) { return a + parseFloat(b.fv.toString()) }, 0));

                carbMacros.push((totalCarb / totalC) * 100.0);
                proMacros.push((totalProtein / totalP) * 100.0);
                fatMacros.push((totalFat / totalF) * 100.0);

                chartData2.push({ label: "Dinner", Carb: Math.round((totalCarb / totalC) * 100.0), Protein: Math.round((totalProtein / totalP) * 100.0), Fat: Math.round((totalFat / totalF) * 100.0) });
            }
            else {
                var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove !== true);
                var totalCarb = (meals.reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
                var totalProtein = (meals.reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
                var totalFat = (meals.reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
                var totalVeg = (meals.reduce(function (a, b) { return a + parseFloat(b.fv.toString()) }, 0));

                carbMacros.push((totalCarb / totalC) * 100.0);
                proMacros.push((totalProtein / totalP) * 100.0);
                fatMacros.push((totalFat / totalF) * 100.0);

                chartData2.push({ label: "Snack", Carb: Math.round((totalCarb / totalC) * 100.0), Protein: Math.round((totalProtein / totalP) * 100.0), Fat: Math.round((totalFat / totalF) * 100.0) });
            }
        }

        return (<div>
            <Grid centered>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Segment textAlign='center'>
                            <MacroGuideHeader meals={this.state.meals} guides={this.state.guides} activities={this.state.activities} update={this.state.updated} />
                            <ActivityHeader age={age} activities={this.state.activities} steps={this.state.steps} sleeps={this.state.sleeps} guides={this.state.activityGuides} update={this.state.updated} />
                        </Segment>
                        <Segment attached='top' textAlign='center'>
                            {this.getActivityDetails()}
                        </Segment>
                        <CaloriesRemainingHeader meals={this.state.meals} guides={this.state.guides} activities={this.state.activities} update={this.state.updated} />
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <Card key="Total Macros Consumptions">
                            <Flex alignItems="items-start">
                                <Text>Total Macros Consumptions (%)</Text>
                            </Flex>
                            <BarChart
                                data={data}
                                categories={["Carb", "Protein", "Fat"]}
                                dataKey="label"
                                height="h-72"
                                colors={["red", "blue", "green"]}
                                marginTop="mt-4"
                                showYAxis={false}
                                layout="vertical"
                            />
                        </Card>
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <Card key="Macros Breakdowns by Meal Type">
                            <Flex alignItems="items-start">
                                <Text>Macros Breakdowns by Meal Type (%)</Text>
                            </Flex>
                            <BarChart
                                data={chartData2}
                                categories={["Carb", "Protein", "Fat"]}
                                dataKey="label"
                                height="h-72"
                                colors={["red", "blue", "green"]}
                                marginTop="mt-4"
                            />
                        </Card>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {this.getRows(0)}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {this.getRows(1)}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {this.getRows(2)}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {this.getRows(3)}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Segment>
                            <Header as='h3'>
                                <Icon name='comment' />
                                <Header.Content>Comments</Header.Content>
                            </Header>
                            <MessagesMealsChat clientId={this.props.senderId} toClientId={this.props.clientId} created={this.props.mealDate} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>);
    }
}

export default connect()(MacroGuideReviewModal);
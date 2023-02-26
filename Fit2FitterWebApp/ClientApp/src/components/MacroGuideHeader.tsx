import * as React from 'react';
import { connect } from 'react-redux';
import { Grid, Icon } from 'semantic-ui-react'
import { IMacroGuides, IMeals } from '../models/meals';
import { IActivity } from '../models/activities'
import {
    Card,
    Metric,
    Text,
    Flex,
    BadgeDelta,
    DeltaType,
    ColGrid,
} from '@tremor/react';

interface IProps {
    meals: IMeals;
    guides: IMacroGuides;
    activities: IActivity[]
    update: boolean;
}

interface IMacroRow {
    title: string;
    metric: number;
    metricStr: string;
}

interface IState {
    username: string;
    password: string;
    updated: boolean;
}

class MacroGuideHeader extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '', password: '', updated: false
        };
    }

    getColour = (total: number) => {
        if (total === 1.0) {
            return 'teal';
        }

        if (total > 1.0) {
            return 'red';
        }

        return 'yellow';
    }

    getColour2 = (total: number) => {
        if (total === 1.0) {
            return 'teal';
        }

        if (total > 1.0) {
            return 'yellow';
        }

        return 'yellow';
    }

    getMealTypeIndex = (type: number) => {
        if (type === 1) {
            return 1;
        }
        if (type === 2) {
            return 2;
        }
        if (type === 3) {
            return 3;
        }

        return 0;
    }

    getDeficitColour = (remaining: number) => {
        if (remaining < 1.0) {
            return 'red';
        }

        if (remaining < 500.0) {
            return 'yellow';
        }

        return 'green';
    }

    getMacroIndicatorIcon2 = (value: number) => {
        if (value < 10.0) {
            return (<div><Icon name='arrow down' size='large' color='orange' /><div>Low</div></div>)
        }

        if (value < 80.0) {
            return (<div><Icon name='thumbs up' size='large' color='green' /><div>Good</div></div>)
        }

        if (value > 80.0 && value < 100.0) {
            return (<div><Icon name='exclamation triangle' size='large' color='orange' /><div>Cautious</div></div >)
        }

        if (value >= 100.0) {
            return (<div><Icon name='exclamation triangle' size='large' color='red' /><div>High</div></div>)
        }
    }

    getMacroIndicatorIconForVeg = (value: number) => {
        if (value < 20.0) {
            return (<div><Icon name='arrow down' size='large' color='orange' /><div>Low</div></div>)
        }

        return (<div><Icon name='thumbs up' size='large' color='green' /><div>Good</div></div>)
    }

    GetMacroRow = (row: IMacroRow) => {
        return (
            <Card key={row.title}>
                <Flex alignItems="items-start">
                    <Text>{row.title}</Text>
                </Flex>
                <Flex
                    justifyContent="justify-center"
                    alignItems="items-center"
                >
                    <Metric truncate={true}>{row.metricStr}</Metric>
                </Flex>
                <Flex
                    justifyContent="justify-center"
                    alignItems="items-center"
                >
                    {row.title.toLowerCase() === 'veg %' ? this.getMacroIndicatorIconForVeg(row.metric) : this.getMacroIndicatorIcon2(row.metric)}
                </Flex>
            </Card>
        );
    }

    render() {

        var divLabelStyle1 = {
            color: 'black'
        };

        var foodPortionStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        if (this.state.updated !== this.props.update)
        {
            this.setState({ updated: this.props.update });
        }

        var totalCarb: number = 0.0;
        var totalProtein: number = 0.0;
        var totalFat: number = 0.0;
        var totalVeg: number = 0;
        var totalPortion: number = 0.0;

        for (let i = 0; i < 4; i++) {
            var meals = this.props.meals[this.getMealTypeIndex(i)].filter(x => x.remove !== true);
            totalCarb += (meals.reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
            totalProtein += (meals.reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
            totalFat += (meals.reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
            totalVeg += (meals.reduce(function (a, b) { return a + parseFloat(b.fv.toString()) }, 0));
            totalPortion += (meals.reduce(function (a, b) { return a + parseFloat(b.portion.toString()) }, 0));
        }

        const totalBurntCalories = (this.props.activities.reduce(function (a, b) { return a + b.calories; }, 0));

        const totalRemCarb = this.props.guides.carb - totalCarb;
        const totalRemProtein = this.props.guides.protein - totalProtein;
        const totalRemFat = this.props.guides.fat - totalFat;
        const totalCal = totalCarb * 4 + totalProtein * 4 + totalFat * 9;

        const totalCup = Math.round(totalCarb / 30);
        const totalPalm = Math.round(totalProtein/30);
        const totalThumb = Math.round(totalFat / 12);

        const totalGuideCup = Math.round(this.props.guides.carb / 30);
        const totalGuidePalm = Math.round(this.props.guides.protein / 30);
        const totalGuideThumb = Math.round(this.props.guides.fat / 12);

        const totalCarbPercent = (totalCarb / this.props.guides.carb) * 100.0;
        const totalProteinPercent = (totalProtein / this.props.guides.protein) * 100.0;
        const totalFatPercent = (totalFat / this.props.guides.fat) * 100.0;
        const totalVegPercent = (totalVeg / this.props.guides.fruits) * 100.0;

        const totalMacro = this.props.guides.carb*4 + this.props.guides.protein*4 + this.props.guides.fat*9;
        const deficit = totalMacro - totalCal + totalBurntCalories;
        const deficitPercentage = (deficit / totalMacro) * 100.00;

        return (
            <Grid centered>
                <Grid.Row textAlign='center'>
                    <Grid.Column width={16}>
                        <h5 className="text-handportion">USED MACRO PORTIONS</h5>
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <Grid centered>
                            <Grid.Row columns={4} stretched textAlign='center'>
                                <Grid.Column textAlign='center'>
                                    <div style={foodPortionStyle}>
                                        <img style={foodPortionStyle} src={'cup.PNG'} width='50' height='50' />
                                    </div>
                                    <div><a>Carb</a></div>
                                    <div style={divLabelStyle1}>{totalCup.toFixed(0)}/{totalGuideCup.toFixed(0)}</div>
                                </Grid.Column>
                                <Grid.Column textAlign='center'>
                                    <div style={foodPortionStyle}>
                                        <img style={foodPortionStyle} src={'palm.PNG'} width='50' height='50' />
                                    </div>
                                    <div><a>Protein</a></div>
                                    <div style={divLabelStyle1}>{totalPalm.toFixed(0)}/{totalGuidePalm.toFixed(0)}</div>
                                </Grid.Column>
                                <Grid.Column textAlign='center'>
                                    <div style={foodPortionStyle}>
                                        <img style={foodPortionStyle} src={'thumb.PNG'} width='50' height='50' />
                                    </div>
                                    <div><a>Fat</a></div>
                                    <div style={divLabelStyle1}>{totalThumb.toFixed(0)}/{totalGuideThumb.toFixed(0)}</div>
                                </Grid.Column>
                                <Grid.Column textAlign='center'>
                                    <div style={foodPortionStyle}>
                                        <img style={foodPortionStyle} src={'fist.PNG'} width='50' height='50' />
                                    </div>
                                    <div><a>Veg</a></div>
                                    <div style={divLabelStyle1}>{totalVeg.toFixed(0)}/{this.props.guides.fruits}</div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <Grid centered>
                            <Grid.Row stretched={true} textAlign='center' columns={4}>
                                <Grid.Column stretched={true}  textAlign='center'>
                                    {this.GetMacroRow({ title: 'CARB %', metric: totalCarbPercent, metricStr: totalCarbPercent.toFixed(0) })}
                                </Grid.Column>
                                <Grid.Column stretched={true}  textAlign='center'>
                                    {this.GetMacroRow({ title: 'PROTEIN %', metric: totalProteinPercent, metricStr: totalProteinPercent.toFixed(0) })}
                                </Grid.Column>
                                <Grid.Column stretched={true}  textAlign='center'>
                                    {this.GetMacroRow({ title: 'FAT %', metric: totalFatPercent, metricStr: totalFatPercent.toFixed(0) })}
                                </Grid.Column>
                                <Grid.Column stretched={true} textAlign='center'>
                                    {this.GetMacroRow({ title: 'VEG %', metric: totalVegPercent, metricStr: totalVegPercent.toFixed(0) })}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(MacroGuideHeader);
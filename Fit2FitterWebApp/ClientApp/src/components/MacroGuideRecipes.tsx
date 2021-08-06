import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button, Icon, Input, Grid, Image, List, Search, Dropdown, Menu, Segment, Label, Divider, Loader, Dimmer } from 'semantic-ui-react'
import { isNullOrUndefined } from 'util';
import { IMealDto, IMealDetails, IFoodLegacyDto, IFoodPortionDto, IMealDesc, IRecipeDto, IRecipeItemDto } from '../models/meals';
import { IClientDto } from '../models/clients';
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import AppsMenu from './AppMenus';

interface IProps {
}

interface IOption {
    key: string,
    text: string,
    value: string
}

interface IState {
    dirty: boolean;
    updated: boolean;
    status: string,
    loading: boolean,
    searchResults: IFoodLegacyDto[],
    searchText: string,
    selectedValue: string,
    portions: IOption[],
    selectedPortion: string,
    foodPortionDtos: IFoodPortionDto[],
    apiUpdated: boolean,
    usdaQuantity: number,
    selectedFdcId: string,
    usdaUpdated: boolean,
    imageUploadStatus: string,
    searchFoodResults: IMealDto[],
    dropDownString: IMealDesc[],
    searchFoodText: string,
    selectedFoodValue: string,
    activeItem: string;
    anzQuantity: number,
    selectedFdcIdAnz: string,
    anzUpdated: boolean,
    loadingAnz: boolean,
    searchResultsAnz: IFoodLegacyDto[],
    searchTextAnz: string,
    selectedValueAnz: string,
    portionsAnz: IOption[],
    selectedPortionAnz: string,
    foodPortionDtosAnz: IFoodPortionDto[],
    apiUpdatedAnz: boolean,
    clientDtos: IClientDto[];
    clientDtosUpdated: boolean;
    searchedRecipeDtos: IRecipeDto[];
    recipeDto: IRecipeDto;
    recipeItemDto: IRecipeItemDto;
    recipeItemDtos: IRecipeItemDto[];
    savingInProgress: boolean;
    loadingRecipe: boolean;
    numOfServings: number;
    readOnly: boolean;
}

var divFoodLogoStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators; // ... plus action creators we've requested

class MacroGuideRecipes extends React.Component<LoginProps, IState> {

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            dirty: false,
            updated: false, status: 'Ready', loading: false, searchResults: [], selectedValue: 'No Selection',
            portions: [], selectedPortion: '', apiUpdated: false, foodPortionDtos: [], usdaQuantity: 1.0,
            searchText: '', selectedFdcId: '', usdaUpdated: false, imageUploadStatus: 'No Image', searchFoodResults: [],
            searchFoodText: '', selectedFoodValue: '', dropDownString: [], activeItem: 'ANZ',
            loadingAnz: false, searchResultsAnz: [], selectedValueAnz: 'No Selection',
            portionsAnz: [], selectedPortionAnz: '', foodPortionDtosAnz:[], anzQuantity: 1.0, selectedFdcIdAnz: '', searchTextAnz: '',
            anzUpdated: false, apiUpdatedAnz: false,
            clientDtos: [], clientDtosUpdated: false,
            recipeDto: { id: 0, name: '', carbs: 0, protein: 0, fat: 0, serving: 0.0, photo: '', updated: '', created: '', clientId: 0 },
            recipeItemDto: { id: 0, name: '', dataSource: 'manual', externalId: '0', weight: 0, carbs: 0, protein: 0, fat: 0, updated: '', created: '', recipeId: 0 },
            recipeItemDtos: [], savingInProgress: false, searchedRecipeDtos: [], loadingRecipe: false, numOfServings: 1, readOnly: false
        };
    }

    getDivLabelStyle2 = () => {
        return ({
            color: 'black'
        });
    }

    getDivLabelStyle3 = () => {
        return ({
            color: 'red'
        });
    }

    getDivLabelStyle = () => {
        return ({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fffafa',
            backgroundColor: this.getColour()
        });
    }

    getDivUploadImageStyle = () => {
        return ({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fffafa',
            backgroundColor: this.getUploadImageColour()
        });
    }

    public componentDidMount() {
        this.props.getLogin();
        if (this.props.logins.length > 0) {
            //get client info
            fetch('api/client?clientId=' + this.props.logins[0].clientId)
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, clientDtosUpdated: true
                })).catch(error => console.log(error));
        }
    }

    updateRecipeName = (event: any) => {
        this.state.recipeDto.name = event.target.value;
        this.setState({ recipeDto: this.state.recipeDto, updated: true });
    }

    updateNumOfServings = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ numOfServings: event.target.value, updated: true });
        }
    }

    updateFood = (event: any) => {
        this.state.recipeItemDto.name = event.target.value;
        this.setState({ recipeItemDto: this.state.recipeItemDto, status: 'Pending add to the ingredients' });
    }

    updateWeight = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.recipeItemDto.weight = event.target.value;
            this.setState({ recipeItemDto: this.state.recipeItemDto, updated: true, status: 'Pending add to the ingredients' });
        }
    }

    updateCarb = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.recipeItemDto.carbs = event.target.value;
            this.setState({ recipeItemDto: this.state.recipeItemDto, updated: true, status: 'Pending add to the ingredients' });
        }
    }

    updateProtein = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.recipeItemDto.protein = event.target.value;
            this.setState({ recipeItemDto: this.state.recipeItemDto, updated: true, status: 'Pending add to the ingredients' });
        }
    }

    updateFat = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.recipeItemDto.fat = event.target.value;
            this.setState({ recipeItemDto: this.state.recipeItemDto, updated: true, status: 'Pending add to the ingredients' });
        }
    }

    addMeal = () => {
        if (this.state.recipeItemDto.name.trim().length < 1) {
            this.setState({ status: 'Error: No Food Description' });
            return;
        }

        this.setState({ status: 'Added to the ingredients' });
        var item = this.state.recipeItemDto;
        this.state.recipeItemDtos.push({
            id: 0, name: item.name, dataSource: item.dataSource,
            externalId: item.externalId, weight: parseFloat(item.weight.toString()),
            carbs: parseFloat(item.carbs.toString()),
            protein: parseFloat(item.protein.toString()), fat: parseFloat(item.fat.toString()),
            updated: '', created: '', recipeId: 0
        });
        this.setState({
            recipeItemDtos: this.state.recipeItemDtos, updated: true,
            recipeItemDto: { id: 0, name: '', dataSource: 'manual', externalId: '0', weight: 0, carbs: 0, protein: 0, fat: 0, updated: '', created: '', recipeId: 0 }
        })
    }

    updateUsdaQuantity = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ usdaQuantity: event.target.value, usdaUpdated: true });
        }
    }

    updateAnzQuantity = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ anzQuantity: event.target.value, anzUpdated: true });
        }
    }

    removeLastAddedMeal = () => {
        if (this.state.recipeItemDtos.length > 0) {
            this.state.recipeItemDtos.pop();
            this.setState({ recipeItemDtos: this.state.recipeItemDtos, updated: true })
        }
    }

    getTableRows = () => {
        return (
            this.state.recipeItemDtos.map((item, index) =>
                <Grid.Row className={'row'} key={index} columns={5} stretched>
                    <Grid.Column className={'col_food'} key={index + 1} width={8}>
                        <a key={index + 1}>{item.name}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_weight'} key={index + 2} width={2}>
                        <a key={index + 2}>{parseFloat(item.weight.toString()).toFixed(2)}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_carb'} key={index + 3} width={2}>
                        <a key={index + 2}>{parseFloat(item.carbs.toString()).toFixed(2)}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_protein'} key={index + 4} width={2}>
                        <a key={index + 3}>{parseFloat(item.protein.toString()).toFixed(2)}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_fat'} key={index + 5} width={2}>
                        <a key={index + 4}>{parseFloat(item.fat.toString()).toFixed(2)}</a>
                    </Grid.Column>
                </Grid.Row>
            ));
    }

    getRows = () => {
        if (this.state.recipeItemDtos.length < 1) {
            return (<div><Segment>Empty</Segment></div>);
        }

        var totalWeight = (this.state.recipeItemDtos.reduce(function (a, b) { return a + parseFloat(b.weight.toString()) }, 0));
        var totalCarb = (this.state.recipeItemDtos.reduce(function (a, b) { return a + parseFloat(b.carbs.toString()) }, 0));
        var totalProtein = (this.state.recipeItemDtos.reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
        var totalFat = (this.state.recipeItemDtos.reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));

        return (
            <div>
                <Segment textAlign='center' attached='bottom'>
                    <Grid centered>
                        <Grid.Row columns={6} textAlign='left' color='grey'>
                            <Grid.Column width={2}>
                            </Grid.Column>
                            <Grid.Column width={6} textAlign='left'>
                                <div><a>Item's Name</a></div>
                            </Grid.Column>
                            <Grid.Column width={2} textAlign='left'>
                                <div><a>Wg(g)</a></div>
                            </Grid.Column>
                            <Grid.Column width={2} textAlign='left'>
                                <div><a>Ca(g)</a></div>
                            </Grid.Column>
                            <Grid.Column width={2} textAlign='left'>
                                <div><a>Pro(g)</a></div>
                            </Grid.Column>
                            <Grid.Column width={2} textAlign='left'>
                                <div><a>Fa(g)</a></div>
                            </Grid.Column>
                        </Grid.Row>
                        {this.getTableRows()}
                        <Grid.Row textAlign='left' color='black' className={'row'} key={1} columns={5} stretched>
                            <Grid.Column className={'col_food'} key={1} width={8} textAlign='left'>
                                <a key={1}>Total Weight</a>
                            </Grid.Column>
                            <Grid.Column className={'col_weight'} key={5} width={2}>
                                <a key={5}>{totalWeight.toFixed(2)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_carb'} key={2} width={2}>
                                <a key={2}>{totalCarb.toFixed(2)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_protein'} key={3} width={2}>
                                <a key={3}>{totalProtein.toFixed(2)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_fat'} key={4} width={2}>
                                <a key={4}>{totalFat.toFixed(2)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_food'} key={6} width={8} textAlign='left'>
                                <a key={1}>100g Portion</a>
                            </Grid.Column>
                            <Grid.Column className={'col_fv'} key={7} width={2}>
                                <a key={5}>100.00</a>
                            </Grid.Column>
                            <Grid.Column className={'col_carb'} key={8} width={2}>
                                <a key={2}>{((totalCarb / totalWeight)*100.00).toFixed(2)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_protein'} key={9} width={2}>
                                <a key={3}>{((totalProtein / totalWeight)*100).toFixed(2)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_fat'} key={10} width={2}>
                                <a key={4}>{((totalFat / totalWeight) * 100).toFixed(2)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_food'} key={11} width={8} textAlign='left'>
                                <a key={1}>Per-Serving Portion</a>
                            </Grid.Column>
                            <Grid.Column className={'col_fv'} key={12} width={2}>
                                <a key={5}>{totalWeight / this.state.numOfServings}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_carb'} key={13} width={2}>
                                <a key={2}>{((totalCarb / this.state.numOfServings)).toFixed(2)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_protein'} key={14} width={2}>
                                <a key={3}>{((totalProtein / this.state.numOfServings)).toFixed(2)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_fat'} key={15} width={2}>
                                <a key={4}>{((totalFat / this.state.numOfServings)).toFixed(2)}</a>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        );
    }

    getColour = () => {
        if (this.state.status.includes('Error')) {
            return 'red';
        }

        if (this.state.status.includes('Pending')) {
            return 'orange';
        }

        if (this.state.status.includes('Updating')) {
            return 'red';
        }

        return 'green';
    }

    getUploadImageColour = () => {
        if (this.state.imageUploadStatus.includes('Uploading')) {
            return 'orange';
        }

        if (this.state.imageUploadStatus.includes('No Image')) {
            return 'black';
        }

        return 'green';
    }

    handleSearchChange = (e: any, data: any) => {
        this.setState({ loading: true });

        fetch('api/food/' + data['value'] + '/foods')
            .then(response => response.json() as Promise<IFoodLegacyDto[]>)
            .then(data => this.setState({
                searchResults: data, loading: false
            })).catch(error => console.log(error))

        this.setState({ searchText: data['value'] });
    }

    handleSelectPortion = (event: any, data: any) => {
        this.setState({ usdaUpdated: true, selectedPortion: data['value'] });
    }

    addUsda = () => {
        this.state.recipeItemDto.name = this.state.selectedValue;
        this.state.recipeItemDto.dataSource = 'USDA';
        if (this.state.portions.length > 0 && this.state.foodPortionDtos.length > 0) {
            this.state.foodPortionDtos.forEach(x => {
                if (x.modifier === this.state.selectedPortion) {
                    this.state.recipeItemDto.externalId = x.fdcId;
                    this.state.recipeItemDto.carbs = parseFloat((this.state.usdaQuantity * x.carbValue * x.gramWeight).toFixed(2));
                    this.state.recipeItemDto.protein = parseFloat((this.state.usdaQuantity * x.proteinValue * x.gramWeight).toFixed(2));
                    this.state.recipeItemDto.fat = parseFloat((this.state.usdaQuantity * x.fatValue * x.gramWeight).toFixed(2));
                    var totalWeight = this.state.usdaQuantity * x.gramWeight;
                    this.state.recipeItemDto.weight = totalWeight;
                    this.state.recipeItemDto.name = this.state.selectedValue + ' (' + totalWeight.toFixed(2) + 'g)';
                }
            });
        }
        else {
            this.state.recipeItemDto.weight = 0.0;
            this.state.recipeItemDto.carbs = 0.0;
            this.state.recipeItemDto.protein = 0.0;
            this.state.recipeItemDto.fat = 0.0;
        }

        this.setState({ recipeItemDto: this.state.recipeItemDto, status: 'Pending add to the ingredients', updated: true });
    }

    handleImageChange = (event: any) => {
        const formData = new FormData()
        formData.append('Filename', event.target.files[0]['name'])
        formData.append('FormFile', event.target.files[0])
        this.setState({ imageUploadStatus: 'Uploading..' });
        fetch('api/Utilities/image/meal/upload',
            {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(uploadedFilename => {
                console.log(uploadedFilename)
                this.state.recipeDto.photo = uploadedFilename;
                this.setState({ recipeDto: this.state.recipeDto, updated: true, imageUploadStatus: 'Uploaded' });
            })
            .catch(error => {
                console.error(error)
            })
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    handleSelectResult = (e: any, data: any) => {
        this.setState({ status: 'Updating Data From USDA.......' });
        var sel = data['result'];
        if (!isNullOrUndefined(sel)) {
            this.setState({ selectedValue: sel['description'] });
            var fdcId = sel['fdcId'];

            fetch('api/food/' + fdcId + '/food/portions')
                .then(response => response.json() as Promise<IFoodPortionDto[]>)
                .then(data => this.setState({
                    foodPortionDtos: data, apiUpdated: true, portions: [], usdaQuantity: 1.0, selectedFdcId: fdcId
                })).catch(error => console.log(error))
        }
    }

    getUsda = () => {
        return (<Segment attached='bottom'>
            <div style={divFoodLogoStyle}>
                <Image circular size='tiny' src='USDALogo.jfif' href='https://www.usda.gov/topics/food-and-nutrition' target='_blank' />
            </div>
            <Grid centered>
                <Grid.Row stretched textAlign='center'>
                    <Grid.Column textAlign='center' width={16}>
                        <Search
                            fluid
                            size='small'
                            loading={this.state.loading}
                            onSearchChange={this.handleSearchChange}
                            onResultSelect={this.handleSelectResult}
                            results={this.state.searchResults}
                            value={this.state.searchText}
                        />
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle' as='a' width={16} textAlign='center'>
                        <div style={this.getDivLabelStyle3()}>
                            <a style={this.getDivLabelStyle3()} href={'https://fdc.nal.usda.gov/fdc-app.html#/food-details/' + this.state.selectedFdcId + '/nutrients'} target='_blank'>source link: {this.state.selectedValue}</a>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={16} textAlign='center'>
                        <Grid centered>
                            <Grid.Row columns={3} stretched textAlign='left'>
                                <Grid.Column width={4} textAlign='left'>
                                    <a style={this.getDivLabelStyle2()}>Quantity:</a>
                                </Grid.Column>
                                <Grid.Column width={2} textAlign='left'>
                                </Grid.Column>
                                <Grid.Column width={10} textAlign='left' floated='left'>
                                    <a style={this.getDivLabelStyle2()}>Portions:</a>
                                </Grid.Column>
                                <Grid.Column width={4} textAlign='left'>
                                    <Input size='small' value={this.state.usdaQuantity} onChange={this.updateUsdaQuantity} placeholder='Quantity' />
                                </Grid.Column>
                                <Grid.Column width={2} textAlign='center'>
                                    <div style={this.getDivLabelStyle2()}>
                                        <h3>x</h3>
                                    </div>
                                </Grid.Column>
                                <Grid.Column width={10} textAlign='left'>
                                    <Dropdown fluid id='portions' value={this.state.selectedPortion} selection options={this.state.portions} onChange={this.handleSelectPortion} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>);
    }

    handleSearchChangeAnz = (e: any, data: any) => {
        this.setState({ loadingAnz: true });

        fetch('api/food/' + data['value'] + '/anz/foods')
            .then(response => response.json() as Promise<IFoodLegacyDto[]>)
            .then(data => this.setState({
                searchResultsAnz: data, loadingAnz: false
            })).catch(error => console.log(error))

        this.setState({ searchTextAnz: data['value'] });
    }

    handleSelectResultAnz = (e: any, data: any) => {
        this.setState({ status: 'Updating Data From FSANZ.......' });
        var sel = data['result'];
        if (!isNullOrUndefined(sel)) {
            this.setState({ selectedValueAnz: sel['description'] });
            var fdcId = sel['fdcId'];

            fetch('api/food/' + fdcId + '/anz/food/portions')
                .then(response => response.json() as Promise<IFoodPortionDto[]>)
                .then(data => this.setState({
                    foodPortionDtosAnz: data, apiUpdatedAnz: true, portionsAnz: [], anzQuantity: 1.0, selectedFdcIdAnz: fdcId
                })).catch(error => console.log(error))
        }
    }

    handleSelectPortionAnz = (event: any, data: any) => {
        this.setState({ anzUpdated: true, selectedPortionAnz: data['value'] });
    }

    addAnz = () => {
        this.state.recipeItemDto.name = this.state.selectedValueAnz;
        this.state.recipeItemDto.dataSource = 'ANZ';
        if (this.state.portionsAnz.length > 0 && this.state.foodPortionDtosAnz.length > 0) {
            this.state.foodPortionDtosAnz.forEach(x => {
                if (x.modifier === this.state.selectedPortionAnz) {
                    this.state.recipeItemDto.externalId = x.fdcId;
                    this.state.recipeItemDto.carbs = parseFloat((this.state.anzQuantity * x.carbValue * x.gramWeight).toFixed(2));
                    this.state.recipeItemDto.protein = parseFloat((this.state.anzQuantity * x.proteinValue * x.gramWeight).toFixed(2));
                    this.state.recipeItemDto.fat = parseFloat((this.state.anzQuantity * x.fatValue * x.gramWeight).toFixed(2));
                    var totalWeight = this.state.anzQuantity * x.gramWeight;
                    this.state.recipeItemDto.weight = totalWeight; 
                    this.state.recipeItemDto.name = this.state.selectedValueAnz + ' (' + totalWeight.toFixed(2) + 'g)';
                }
            });
        }
        else {
            this.state.recipeItemDto.weight = 0.0;
            this.state.recipeItemDto.carbs = 0.0;
            this.state.recipeItemDto.protein = 0.0;
            this.state.recipeItemDto.fat = 0.0;
        }

        this.setState({ recipeItemDto: this.state.recipeItemDto, status: 'Pending add to the ingredients', updated: true });
    }

    getFsanz = () => {
        return (<Segment attached='bottom'>
            <div style={divFoodLogoStyle}>
                <Image circular size='small' src='FSANZLogo.jpg' href='https://www.foodstandards.gov.au/' target='_blank' />
            </div>
            <Grid centered>
                <Grid.Row stretched textAlign='center'>
                    <Grid.Column textAlign='center' width={16}>
                        <Search
                            disabled={this.state.readOnly}
                            fluid
                            size='small'
                            loading={this.state.loadingAnz}
                            onSearchChange={this.handleSearchChangeAnz}
                            onResultSelect={this.handleSelectResultAnz}
                            results={this.state.searchResultsAnz}
                            value={this.state.searchTextAnz}
                        />
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle' as='a' width={16} textAlign='center'>
                        <div style={this.getDivLabelStyle3()}>
                            <a style={this.getDivLabelStyle3()} href={'https://www.foodstandards.gov.au/science/monitoringnutrients/afcd/Pages/fooddetails.aspx?PFKID=' + this.state.selectedFdcIdAnz} target='_blank'>source link: {this.state.selectedValueAnz}</a>
                        </div>
                    </Grid.Column>
                    <Grid.Column textAlign='center' width={16}>
                        <Grid centered>
                            <Grid.Row columns={3} stretched textAlign='left'>
                                <Grid.Column width={4} textAlign='left'>
                                    <a style={this.getDivLabelStyle2()}>Quantity:</a>
                                </Grid.Column>
                                <Grid.Column width={2} textAlign='left'>
                                </Grid.Column>
                                <Grid.Column width={10} textAlign='left' floated='left'>
                                    <a style={this.getDivLabelStyle2()}>Portions:</a>
                                </Grid.Column>
                                <Grid.Column width={4} textAlign='left'>
                                    <Input size='small' value={this.state.anzQuantity} onChange={this.updateAnzQuantity} placeholder='Quantity' />
                                </Grid.Column>
                                <Grid.Column width={2} textAlign='center'>
                                    <div style={this.getDivLabelStyle2()}>
                                        <h3>x</h3>
                                    </div>
                                </Grid.Column>
                                <Grid.Column width={10} textAlign='left'>
                                    <Dropdown fluid id='portions' value={this.state.selectedPortionAnz} selection options={this.state.portionsAnz} onChange={this.handleSelectPortionAnz} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>);
    }

    getManualEntry = () => {
        return (<Segment attached='bottom'>
            <Grid centered>
                <Grid.Row stretched>
                    <Grid.Column as='a' width={6} textAlign='left'>
                        <h5>Name</h5>
                    </Grid.Column>
                    <Grid.Column width={10} textAlign='center'>
                        <input value={this.state.recipeItemDto.name} onChange={this.updateFood} placeholder='Foods' />
                    </Grid.Column>
                    <Grid.Column as='a' width={6} textAlign='left'>
                        <h5>Actual Weight (g)</h5>
                    </Grid.Column>
                    <Grid.Column width={10} textAlign='center'>
                        <input value={this.state.recipeItemDto.weight} onChange={this.updateWeight} placeholder='Weight' />
                    </Grid.Column>
                    <Grid.Column as='a' width={6} textAlign='left'>
                        <h5>Carb (g)</h5>
                    </Grid.Column>
                    <Grid.Column width={10} textAlign='center'>
                        <input value={this.state.recipeItemDto.carbs} onChange={this.updateCarb} placeholder='Carbs' />
                    </Grid.Column>
                    <Grid.Column as='a' width={6} textAlign='left'>
                        <h5>Protein (g)</h5>
                    </Grid.Column>
                    <Grid.Column width={10} textAlign='center'>
                        <input value={this.state.recipeItemDto.protein} onChange={this.updateProtein} placeholder='Protein' />
                    </Grid.Column>
                    <Grid.Column as='a' width={6} textAlign='left'>
                        <h5>Fat (g)</h5>
                    </Grid.Column>
                    <Grid.Column width={10} textAlign='center'>
                        <input value={this.state.recipeItemDto.fat} onChange={this.updateFat} placeholder='Fat' />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>);
    }

    getSearchOption = () => {
        if (!this.state.readOnly) {
            if (this.state.activeItem == 'USDA') {
                return this.getUsda();
            }
            else if (this.state.activeItem == 'ANZ') {
                return this.getFsanz();
            }
            else if (this.state.activeItem == 'manual') {
                return this.getManualEntry();
            }
        }

        return (<div><Segment attached='bottom'><h5>Not Applicable</h5></Segment></div>);
    }

    handleFoodSelectResult = (e: any, data: any) => {
        this.setState({ status: 'Updating Data .......', loadingRecipe: true });
        var sel = data['result'];
        if (!isNullOrUndefined(sel)) {
            this.setState({ selectedFoodValue: sel['description'] });
            var id = sel['id'];
            var recipe = this.state.searchedRecipeDtos.find(x => x.id === parseInt(id));
            if (recipe != null) {
                var imageUploadStatus = '';
                console.log(recipe);
                if (recipe.photo !== '') {
                    imageUploadStatus = 'Uploaded';
                }

                var recipeDto: IRecipeDto = {
                    id: recipe.id, name: recipe.name, carbs: recipe.carbs,
                    protein: recipe.protein, fat: recipe.fat, serving: recipe.serving,
                    photo: recipe.photo, updated: recipe.updated, created: recipe.created,
                    clientId: recipe.clientId
                };

                fetch('api/food/' + recipe.id + '/recipe/items')
                    .then(response => response.json() as Promise<IRecipeItemDto[]>)
                    .then(data => {
                        var totalWeight = (data.reduce(function(a, b) { return a + parseFloat(b.weight.toString()) }, 0));
                        var numOfServings = totalWeight / recipeDto.serving;
                        this.setState({
                            recipeItemDtos: data,
                            recipeDto: recipeDto,
                            updated: true, imageUploadStatus: imageUploadStatus,
                            numOfServings: numOfServings,
                            loadingRecipe: false, status: 'Read-Only Mode',
                            readOnly: true
                        });
                    }).catch(error => console.log(error))
            }
        }
    }

    handleFoodSearchChange = (e: any, data: any) => {
        this.setState({ loading: true });
        fetch('api/food/' + this.props.logins[0].clientId + '/recipes/search?keyword=' + data['value'])
            .then(response => response.json() as Promise<IRecipeDto[]>)
            .then(data => {
                let results: IMealDesc[] = [];
                data.forEach(x => results.push({ id: x.id.toString(), description: x.name }));
                this.setState({
                    searchedRecipeDtos: data, loading: false, dropDownString: results
                })
            }).catch(error => console.log(error));

        this.setState({ searchFoodText: data['value'] });
    }

    getRecipesSearch = () => {
        return (<Search
            fluid
            size='tiny'
            loading={this.state.loading}
            onSearchChange={this.handleFoodSearchChange}
            onResultSelect={this.handleFoodSelectResult}
            results={this.state.dropDownString}
            value={this.state.searchFoodText}
        />);
    }

    getRecipeDetails = () => {
        return (
        <Segment textAlign='center' attached='bottom'>
             <Grid centered>
                <Grid.Row stretched>
                    <Grid.Column as='a' width={6} textAlign='left'>
                        <h5>Find Recipes (View)</h5>
                    </Grid.Column>
                    <Grid.Column width={10} textAlign='center'>
                        {this.getRecipesSearch()}
                    </Grid.Column>
                    <Grid.Column as='a' width={6} textAlign='left'>
                        <h5>Recipe's Name</h5>
                    </Grid.Column>
                    <Grid.Column width={10} textAlign='left'>
                        <input disabled={this.state.readOnly} value={this.state.recipeDto.name} onChange={this.updateRecipeName} placeholder='Foods' />
                    </Grid.Column>
                    <Grid.Column as='a' width={6} textAlign='left'>
                        <h5>Number of Servings</h5>
                    </Grid.Column>
                    <Grid.Column width={10} textAlign='center'>
                        <input disabled={this.state.readOnly} value={this.state.numOfServings} onChange={this.updateNumOfServings} placeholder='number of servings' />
                    </Grid.Column>
                    <Grid.Column as='a' width={6} textAlign='left'>
                        <h5>Image</h5>
                    </Grid.Column>
                    <Grid.Column width={10} textAlign='center'>
                        <div>
                            <div style={this.getDivUploadImageStyle()}>
                                <a>{this.state.imageUploadStatus}</a>
                            </div>
                            <input
                                disabled={this.state.readOnly}
                                type='file'
                                accept="image/*"
                                onChange={this.handleImageChange}
                            />
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>);
    }

    isLoadingData = () => {
        if (!this.state.clientDtosUpdated || this.state.savingInProgress || this.state.loadingRecipe) {
            return true;
        }

        return false;
    }

    resetRecipe = (status: string) => {
        this.setState({
            savingInProgress: false,
            recipeDto: { id: 0, name: '', carbs: 0, protein: 0, fat: 0, serving: 0, photo: '', updated: '', created: '', clientId: 0 },
            recipeItemDtos: [], selectedValueAnz: 'No Selection', selectedValue: 'No Selection', selectedFdcId: '', selectedFdcIdAnz: '',
            status: status, portions: [], portionsAnz: [],
            searchFoodText: '', searchedRecipeDtos: [], searchText: '', searchTextAnz: '', searchFoodResults: [], searchResults: [], searchResultsAnz: [],
            recipeItemDto: { id: 0, name: '', dataSource: 'manual', externalId: '0', weight: 0, carbs: 0, protein: 0, fat: 0, updated: '', created: '', recipeId: 0 },
            numOfServings: 1, readOnly: false
        });
    }

    onSaveRecipeItems = (recipeId: number) => {
        var recipeItems: IRecipeItemDto[] = [];

        this.state.recipeItemDtos.forEach(x => {
            recipeItems.push({
                id: 0, name: x.name, dataSource: x.dataSource, externalId: x.externalId,
                weight: x.weight, carbs: x.carbs, protein: x.protein, fat: x.fat,
                updated: (new Date()).toISOString(), created: (new Date()).toISOString(),
                recipeId: recipeId
            });
        });

        console.log(recipeItems);

        var fetchStr = 'api/food/recipe/items';
        fetch(fetchStr, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipeItems)
        }).then(response => response.json()).then(data => {
            console.log('saving recipe items done...');
            this.resetRecipe('Successfully created recipe');
        }).catch(error => console.log('save recipe items  ---------->' + error));
    }

    onSave = () => {
        if (this.state.recipeDto.name == '' || this.state.numOfServings < 1.0) {
            this.setState({ status: 'Error: Recipe name or serving is invalid!!' });
            return;
        }

        if (this.state.recipeItemDtos.length < 1) {
            this.setState({ status: 'Error: List of ingredients is empty!!' });
            return;
        }

        this.setState({ savingInProgress: true });
        var totalWeight = (this.state.recipeItemDtos.reduce(function (a, b) { return a + parseFloat(b.weight.toString()) }, 0));
        var totalCarb = (this.state.recipeItemDtos.reduce(function (a, b) { return a + parseFloat(b.carbs.toString()) }, 0));
        var totalProtein = (this.state.recipeItemDtos.reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
        var totalFat = (this.state.recipeItemDtos.reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));

        // save recipe
        var recipeDto = this.state.recipeDto;
        recipeDto.clientId = this.props.logins[0].clientId;
        recipeDto.updated = (new Date()).toISOString();
        recipeDto.created = (new Date()).toISOString();
        recipeDto.serving = totalWeight / parseInt(this.state.numOfServings.toString());
        recipeDto.carbs = ((totalCarb / totalWeight) * 100.00);
        recipeDto.protein = ((totalProtein / totalWeight) * 100.00);
        recipeDto.fat = ((totalFat / totalWeight) * 100.00);
        console.log(recipeDto);

        var fetchStr = 'api/food/' + this.props.logins[0].clientId + '/recipe';
        fetch(fetchStr, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipeDto)
        }).then(response => response.json() as Promise<number>).then(recipeId => {
            this.onSaveRecipeItems(recipeId);
            console.log('saving done...' + recipeId);
        }).catch(error => console.log('save recipe  ---------->' + error));
    }

    onDelete = () => {
        if (this.state.recipeDto.id < 1) {
            this.setState({ status: 'Error: Unable to delete, Recipe is invalid!!' });
            return;
        }

        var fetchStr = 'api/food/' + this.state.recipeDto.id + '/recipe/delete';
        fetch(fetchStr, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json()).then(data => {
            console.log('delete is done...');
            this.resetRecipe('Successfully deleted recipe');
        }).catch(error => console.log('delete recipe  ---------->' + error));
    }

    onClear = () => {
        this.resetRecipe('Ready');
    }

    render() {
        var divLoaderStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        if (this.props.logins.length > 0) {
            if (this.state.usdaUpdated === true) {
                this.setState({ usdaUpdated: false });
                this.addUsda();
            }

            if (this.state.anzUpdated === true) {
                this.setState({ anzUpdated: false });
                this.addAnz();
            }

            if (this.state.updated === true) {
                this.setState({ updated: false });
            }

            if (this.state.apiUpdated === true) {
                this.setState({ apiUpdated: false });

                this.state.foodPortionDtos.forEach(x => {
                    this.state.portions.push({ key: x.modifier, value: x.modifier, text: x.amount + ' ' + x.modifier + ' (' + x.gramWeight + 'g)' });
                });

                if (this.state.foodPortionDtos.length > 0) {
                    this.setState({ portions: this.state.portions, selectedPortion: this.state.foodPortionDtos[0].modifier });
                }

                this.setState({ usdaUpdated: true });
            }

            if (this.state.apiUpdatedAnz === true) {
                this.setState({ apiUpdatedAnz: false });

                this.state.foodPortionDtosAnz.forEach(x => {
                    this.state.portionsAnz.push({ key: x.modifier, value: x.modifier, text: x.amount + ' ' + x.modifier + ' (' + x.gramWeight + 'g)' });
                });

                if (this.state.foodPortionDtosAnz.length > 0) {
                    this.setState({ portionsAnz: this.state.portionsAnz, selectedPortionAnz: this.state.foodPortionDtosAnz[0].modifier });
                }

                this.setState({ anzUpdated: true });
            }

            if (this.isLoadingData()) {
                return (<div style={divLoaderStyle}>
                    <Dimmer active inverted>
                        <Loader content='Loading' />
                    </Dimmer>
                </div>);
            }

            const activeItem = this.state.activeItem;
            return (<div>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <AppsMenu activeItem='CreateRecipes' logins={this.props.logins} clientDtos={this.state.clientDtos} />
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <h5>Step 1. Create/View Your Recipe</h5>
                        </Grid.Column>
                        <Grid.Column width={16} verticalAlign='middle'>
                            {this.getRecipeDetails()}
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <h5>Step 2. Add Ingredients</h5>
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <Menu attached='top' pointing compact>
                                <Menu.Item
                                    name='ANZ'
                                    active={activeItem === 'ANZ'}
                                    onClick={this.handleItemClick}
                                />
                                <Menu.Item
                                    name='USDA'
                                    active={activeItem === 'USDA'}
                                    onClick={this.handleItemClick}
                                />
                                <Menu.Item
                                    name='manual'
                                    active={activeItem === 'manual'}
                                    onClick={this.handleItemClick}
                                />
                            </Menu>
                            {this.getSearchOption()}
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <Segment inverted color='grey'>
                                <Grid centered>
                                    <Grid.Row stretched>
                                        <Grid.Column width={4}>
                                            <Button disabled={this.state.readOnly} size='tiny' inverted fluid color={this.getColour()} onClick={this.addMeal}>Add</Button>
                                        </Grid.Column>
                                        <Grid.Column width={4}>
                                            <Button disabled={this.state.readOnly} size='tiny' inverted fluid color='black' onClick={this.removeLastAddedMeal}>Undo</Button>
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            <span style={this.getDivLabelStyle()}>
                                                <a>{this.state.status}</a>
                                            </span>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <h5>Step 3. Review of Ingredients</h5>
                        </Grid.Column>
                        <Grid.Column width={16}>
                            {this.getRows()}
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='left' floated='left'>
                            <Button.Group floated='left' fluid>
                                <Button color='black' floated='left' size='tiny' onClick={this.onClear}>New</Button>
                                <Button disabled={this.state.readOnly} color='blue' floated='left' size='tiny' onClick={this.onSave}>Save</Button>
                                <Button color='red' floated='left' size='tiny' onClick={this.onDelete}>Delete</Button>
                            </Button.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>);
        }
        return (<Redirect to="/" />);
    }
}

export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(MacroGuideRecipes as any);
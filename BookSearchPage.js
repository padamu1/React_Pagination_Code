import React from "react";
import './BookSearchPage.css';


class BookSearchPage extends React.Component {
    constructor() {
        super();
        this.state = {
            loadingButton: false,
            search: null,
            page: 1,
            pages: 1,
            result: [],
            datas: null,
            isDataLoading: true
        };
    }
    componentDidMount() {
        this.loadingData();
    }
    componentDidUpdate() {
        if (this.state.isDataLoading === true) {
            this.loadingData();
        }
    }


    searchSpace = (event) => {
        if (event.key === 'Enter') {
            let keyword = event.target.value;
            this.setState({ page: 1, search: keyword, loadingButton: false })
        }

    }

    
    //  Page Action
    _changePage(el) {
        switch (el) {
            case '←':
                if (this.state.page % 10 !== 0) {
                    el = (this.state.page - 10) - (this.state.page % 10) + 1
                } else {
                    el = this.state.page - 10;
                }
                break;
            case '→':
                if (this.state.page % 10 !== 0) {
                    el = (this.state.page + 10) - (this.state.page % 10) + 1
                } else {
                    el = this.state.page + 10;
                }
                if (el > this.state.pages) {
                    el = this.state.pages
                }
                break;
            default:
                break;
        }
        this.setState({ page: el, loadingButton: false });
    }

    //  Add button at the page
    pageButton = function (datas) {
        let resultButton = [];
        let tempPages = 0;
        if (datas.length % 10 === 0) {
            tempPages = parseInt(datas.length / 10);
        } else {
            tempPages = parseInt(datas.length / 10) + 1;
        }
        var page = this.state.page;
        if (page / 10 >= 1 && page !== 10)
            resultButton.push('←');
        if (page / 10 >= 1) {
            if (page % 10 === 0) {
                page = page - 9;
            } else {
                page = page - (page % 10) + 1;
            }
        } else {
            page = 1;
        }
        var i = page;
        for (i = page; i < page + 10; i++) {
            if (i <= tempPages) {
                resultButton.push(i);
            }
        }
        if (i < tempPages) {
            i = i + 1;
            resultButton.push('→');
        }
        this.setState({ result: resultButton, loadingButton: true, pages: tempPages});
    }

    // loading data
    loadingData = function(){
        const url = "http://"URL"/book/list/";

        fetch(url, {
      
        headers : {
         'Accept':'application/json',
         'Content-Type':'application/json'
      
        }}) 
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
                isDataLoading:false,
                datas: result
            });
        })
    }

    //  render
    render() {
        if (this.state.isDataLoading === true) {
            return(<div>로딩중</div>)
        } else {
            const styleInfo = {
                paddingRight: '10px'
            }
            
            const datas= this.state.datas;
            console.log(datas);
            const items = datas.filter((data) => {
                if (this.state.search === null) {
                    return data
                }
                else if (data.title.toLowerCase().includes(this.state.search.toLowerCase()) || data.author.toLowerCase().includes(this.state.search.toLowerCase())) {
                    return data
                }
            })
            const elementStyle = {
                border: 'solid',
                borderRadius: '10px',
                position: 'relative',
                left: '10vh',
                height: '3vh',
                width: '20vh',
                marginTop: '5vh',
                marginBottom: '10vh'
            }

            //  change button using changed data
            if (this.state.loadingButton === false) {
                this.pageButton(items);
                return (<div></div>)
            } else {
                return (
                    <div>
                        <input type="text" placeholder={this.state.search !== '' ? this.state.search : "Enter the search item"} style={elementStyle} onKeyPress={(e) => this.searchSpace(e)} />
                        <div>
                            현재페이지 : {this.state.page}
                        </div>
                        {items.slice(10 * (this.state.page - 1), 10 * this.state.page).map(data => {
                            return (
                                <div className='list_grid list_data'>
                                    <ul>
                                        <div>
                                            <div>
                                                <span dangerouslySetInnerHTML={{ __html: data.title }}></span>
                                                <span className='spanright'>{data.author}</span>
                                            </div>
                                            <div>
                                            
                                            <span className='spanright'>{data.publisher}</span>
                                            </div>
                                        </div>
                                    </ul>
                                </div >
                            )
                        })}
                        <div>
                            {this.state.result.map(index => {
                                return (<button className={index===this.state.page ?"blue" : ""} onClick={this._changePage.bind(this, index)}>{index}</button>)
                            })}
                        </div>
                    </div>
                )
            }
        }
    }
}
export default BookSearchPage;

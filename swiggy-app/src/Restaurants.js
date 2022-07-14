import React from "react";
import "./list.scss";
import Item from "./Item";
import Sidebar from "./Sidebar";

class Restaurants extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      allRestaurants: [],
      showAll: false,
      activeCategory: "popular brands",
      visibleItems: {},
      isAutoScrolling: false,
    };
    const intersectionCallback = (entries) => {
      // console.log(entries);
      if (entries.length === 1 && this.state.isAutoScrolling === false) {
        if (
          entries[0].isIntersecting === false &&
          entries[0].boundingClientRect.bottom < 0
        ) {
          // section scrolled to up, select the next section.
          let hideSectionId = entries[0].target.id;
          console.log("hideSectionId: ", hideSectionId);
          let hideSectionIndex = this.state.categories.findIndex(
            (category) => category.category === hideSectionId
          );
          if (hideSectionIndex !== -1) {
            this.setState({
              activeCategory:
                this.state.categories[hideSectionIndex + 1].category,
            });
          }
        } else if (
          entries[0].isIntersecting === true &&
          entries[0].boundingClientRect.bottom >= 0 &&
          entries[0].boundingClientRect.y <= 0
        ) {
          // section comming from top. Set as selected.
          let upcommingSectionId = entries[0].target.id;
          console.log("upcommingSectionId: ", upcommingSectionId);
          let upcommingSectionIndex = this.state.categories.findIndex(
            (category) => category.category === upcommingSectionId
          );
          if (upcommingSectionIndex !== -1) {
            this.setState({
              activeCategory:
                this.state.categories[upcommingSectionIndex].category,
            });
          }
        }
      }
    };

    this.observer = new IntersectionObserver(intersectionCallback, {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    });
  }
  componentDidMount() {
    this.fetchData();
    // document.addEventListener("scroll", this.handleScroll);
    setTimeout(() => {
      this.addObservers();
    }, 2000);
  }
  // componentWillUnmount() {
  // document.removeEventListener("scroll", this.handleScroll);
  // }
  async fetchData() {
    // fetch('http://cdn.adpushup.com/reactTask.json');
    // Above API is served over http, not https & return type is text, not JSON.

    fetch("https://mocki.io/v1/3fb1488d-bbdb-4ddd-9a03-a0d2efc98597")
      .then((_) => {
        return _.json();
      })
      .then((response) => {
        // console.log(response);
        let allRestaurants = [];
        let exclusiveList = [];
        let visibleItems = {};
        response.forEach((category) => {
          allRestaurants = [...allRestaurants, ...category.restaurantList];
          visibleItems[category.category] = 6;
        });
        visibleItems["Only in Swiggy"] = 6;
        allRestaurants.forEach((item) => {
          if (item.isExlusive) {
            exclusiveList.push(item);
          }
        });
        this.setState({
          categories: [
            ...response,
            {
              category: "Only in Swiggy",
              restaurantList: exclusiveList,
            },
          ],
          allRestaurants: allRestaurants,
          activeCategory: response[0].category,
          visibleItems: visibleItems,
        });
      });
  }
  async addObservers() {
    this.state.categories.forEach((category) => {
      let el = document.getElementById(category.category);
      if (el) {
        this.observer.observe(el);
      }
    });
  }
  async selectCategory(category) {
    if (this.state.showAll) {
      // adding observers again
      setTimeout(() => {
        this.addObservers();
      }, 2000);
    }
    await this.setState({ showAll: false, activeCategory: category });
    this.scrollToId(category);
  }
  scrollToId(domId) {
    let element = document.getElementById(domId);
    if (element) {
      // console.log(domId);
      this.setState({ isAutoScrolling: true }); // block intersection in-between
      setTimeout(() => {
        this.setState({ isAutoScrolling: false });
      }, 1000);
      window.scrollTo({ top: element.offsetTop + 1, behavior: "smooth" });
    }
  }
  async showAll() {
    // console.log("Showing all");
    this.observer.disconnect();
    await this.setState({ showAll: true, activeCategory: "See All" });
    this.scrollToId("See All");
  }
  updateVisibleItems(category) {
    this.setState({
      visibleItems: {
        ...this.state.visibleItems,
        [category]: this.state.visibleItems[category] + 6,
      },
    });
  }
  // handleScroll(e) {
  //   console.log(e);
  // }
  render() {
    const { categories, activeCategory, allRestaurants } = this.state;
    return (
      <div className="page-wrap">
        <Sidebar
          categories={categories}
          activeCategory={activeCategory}
          allRestaurants={allRestaurants}
          onClickCategory={(category) => this.selectCategory(category)}
          onShowAll={() => this.showAll()}
        />
        {!this.state.showAll && (
          <div className="list-wrap">
            {this.state.categories.map((category, c) => {
              return (
                <div
                  className="category-block"
                  key={`${category.category}_${c}`}
                  id={category.category}
                >
                  <div className="category-block__name">
                    {category.category}
                  </div>
                  <div className="list-row">
                    {category.restaurantList
                      .slice(0, this.state.visibleItems[category.category])
                      .map((item, i) => {
                        return (
                          <Item
                            data={item}
                            index={i}
                            moreCount={
                              i + 1 ===
                              this.state.visibleItems[category.category]
                                ? category.restaurantList.length -
                                  this.state.visibleItems[category.category]
                                : 0
                            }
                            onShowMore={() =>
                              this.updateVisibleItems(category.category)
                            }
                            key={`${category.category}_${item.name}_${i}`}
                          />
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {this.state.showAll && (
          <div className="list-wrap">
            <div className="category-block" id="See All">
              <div className="category-block__name">All Restaurants</div>
              <div className="list-row">
                {this.state.allRestaurants.map((item, i) => {
                  return (
                    <Item data={item} index={i} key={`${item.name}_${i}`} />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Restaurants;

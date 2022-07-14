import React from "react";
import "./sidebar.scss";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      categories,
      activeCategory,
      allRestaurants,
      onShowAll,
      onClickCategory,
    } = this.props;
    return (
      <div className="sidebar">
        <div className="sidebar-content">
          {categories.map((category) => {
            return (
              <div
                className={`category-item ${
                  activeCategory === category.category ? "--active" : ""
                }`}
                key={category.category}
                onClick={() => onClickCategory(category.category)}
              >
                {category.category}
                <div className="category-item__count">
                  {category.restaurantList.length} Restaurants
                </div>
              </div>
            );
          })}
          <div
            className={`category-item ${
              activeCategory === "See All" ? "--active" : ""
            }`}
            onClick={() => onShowAll()}
          >
            See All
            <div className="category-item__count">
              {allRestaurants.length} Restaurants
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;

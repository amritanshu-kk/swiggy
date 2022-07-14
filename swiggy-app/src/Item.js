import React from "react";
import "./item.scss";

const imgArray = [
  "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1429554513019-6c61c19ffb7e?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1496412705862-e0088f16f791?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1432139509613-5c4255815697?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1484980972926-edee96e0960d?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=500&q=60",
];

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { data, moreCount, index } = this.props;
    return (
      <div className={`item-card  ${moreCount > 0 ? "" : "--allow-hover"}`}>
        <img
          src={imgArray[index % imgArray.length]}
          className="item-thumb"
          alt={data.name}
        />
        <div className="item-card-content">
          {data.name}
          <div className="item-card__tags">
            {data.food_types.slice(0, 3).map((type) => {
              return <div className="item-card__tag">{type}</div>;
            })}
          </div>
          <div className="item-card__stats-row">
            <div
              className={`item-card__star-wrap ${
                data.ratings ? "--green" : ""
              }`}
            >
              ★ {data.ratings || " --"}
            </div>
            <div>•</div>
            <div className="item-card__delivery-time">{data.delivery_time}</div>
            <div>•</div>
            <div className="item-card__price">
              ₹{data.price_for_two} FOR TWO
            </div>
          </div>
          <div className="item-card__quick-view">QUICK VIEW</div>
        </div>
        {moreCount > 0 && (
          <div className="item-card__more-wrap" onClick={this.props.onShowMore}>
            +{moreCount} MORE
          </div>
        )}
      </div>
    );
  }
}

export default Item;

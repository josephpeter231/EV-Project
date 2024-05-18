
import Car from "../../assets/green_car.png";
import Bike from "../../assets/bike.jpg";
import Auto from "../../assets/auto.jpg";

const carList = [
  {
    name: "EV Car",
    price: 280,
    image: Car,
    aosDelay: "0",
  },
  {
    name: "EV Bike",
    price: 110,
    image: Bike,
    aosDelay: "500",
  },
  {
    name: "EV Auto",
    price: 130,
    image: Auto,
    aosDelay: "1000",
  },
];

const CarList = () => {
  return (
    <div className="pb-24">
      <div className="container">
        {/* Heading */}
        <h1
          data-aos="fade-up"
          className="text-3xl sm:text-4xl font-semibold font-serif mb-3"
        >
          Supported Electric Vehicles
        </h1>
        <p data-aos="fade-up" aos-delay="400" className="text-sm pb-10">
          We Support the following Electric Vehicles 
        </p>
        {/* Car listing */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
            {carList.map((data) => (
              <div
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                className="space-y-3 border-2 border-gray-300 hover:border-primary p-3 rounded-xl relative group"
              >
                <div className="w-full h-[120px]">
                  <img
                    src={data.image}
                    alt=""
                    className="w-full h-[120px] object-contain sm:translate-x-8 group-hover:sm:translate-x-16 duration-700"
                  />
                </div>
                <div className="space-y-2">
                  <h1 className="text-primary font-semibold">{data.name}</h1>
                  <div className="flex justify-between items-center text-xl font-semibold">
                    <p>₹{data.price}/Slot</p>
                    {/* <a href="/login">Details</a> */}
                  </div>
                </div>
                {/* <p className="text-xl font-semibold absolute top-0 left-3">
                  12Km
                </p> */}
              </div>
            ))}
          </div>
        </div>
        {/* End of car listing */}
        <div className="grid place-items-center mt-8">
        <a href="/login">
          <button data-aos="fade-up" className="button-outline">
            Get Started
          </button>
        </a>
        </div>
      </div>
    </div>
  );
};

export default CarList;

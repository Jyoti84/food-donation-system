import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function CreateDonation({ onDonationCreated }) {
    const [foodType, setFoodType] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("kg");
    const [bestBefore, setBestBefore] = useState("");
    const [pickupAddress, setPickupAddress] = useState("");
    const [proofImage, setProofImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!proofImage) {
            alert("Please upload a proof image");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();

            formData.append("foodType", foodType);
            formData.append("quantity", Number(quantity));
            formData.append("unit", unit);
            formData.append("bestBefore", bestBefore);
            formData.append("pickupAddress", pickupAddress);
            formData.append("donorProofImage", proofImage);

            const response = await fetch(
                `${API_URL}/api/donations`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            

            setFoodType("");
            setQuantity("");
            setUnit("kg");
            setBestBefore("");
            setPickupAddress("");
            setProofImage(null);

            onDonationCreated();

        } catch (error) {
            console.error("Donation error:", error);
            alert("Server error");
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "13px 14px",
        border: "1px solid #dce5df",
        borderRadius: "9px",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        backgroundColor: "#ffffff"
    };

    const labelStyle = {
        display: "block",
        marginBottom: "7px",
        color: "#344e41",
        fontWeight: "bold",
        fontSize: "14px"
    };

    return (
        <div
            style={{
                width: "100%",
                backgroundColor: "#ffffff",
                borderRadius: "18px",
                padding: "32px",
                marginBottom: "35px",
                boxShadow: "0 6px 20px rgba(52,78,65,0.08)",
                boxSizing: "border-box"
            }}
        >
            <h2
                style={{
                    margin: "0 0 8px",
                    color: "#344e41",
                    fontSize: "25px"
                }}
            >
                🍱 Create a Donation
            </h2>

            <p
                style={{
                    margin: "0 0 25px",
                    color: "#777",
                    fontSize: "14px"
                }}
            >
                Enter the details of the food you want to donate.
            </p>

            <form onSubmit={handleSubmit}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "20px"
                    }}
                >
                    <div>
                        <label style={labelStyle}>
                            Food Type
                        </label>

                        <input
                            type="text"
                            placeholder="Example: Rice and Dal"
                            value={foodType}
                            onChange={(e) =>
                                setFoodType(e.target.value)
                            }
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>
                            Quantity
                        </label>

                        <input
                            type="number"
                            placeholder="Enter quantity"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(e.target.value)
                            }
                            style={inputStyle}
                            min="1"
                            required
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>
                            Unit
                        </label>

                        <select
                            value={unit}
                            onChange={(e) =>
                                setUnit(e.target.value)
                            }
                            style={inputStyle}
                        >
                            <option value="kg">Kg</option>
                            <option value="litre">Litre</option>
                            <option value="packet">
                                Packet
                            </option>
                            <option value="piece">
                                Piece
                            </option>
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>
                            Best Before
                        </label>

                        <input
                            type="datetime-local"
                            value={bestBefore}
                            onChange={(e) =>
                                setBestBefore(e.target.value)
                            }
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div
                        style={{
                            gridColumn: "1 / -1"
                        }}
                    >
                        <label style={labelStyle}>
                            Pickup Address
                        </label>

                        <input
                            type="text"
                            placeholder="Enter pickup address"
                            value={pickupAddress}
                            onChange={(e) =>
                                setPickupAddress(e.target.value)
                            }
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div
                        style={{
                            gridColumn: "1 / -1"
                        }}
                    >
                        <label style={labelStyle}>
                            📷 Food Proof Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setProofImage(e.target.files[0])
                            }
                            style={inputStyle}
                            required
                        />

                        {proofImage && (
                            <p
                                style={{
                                    marginTop: "8px",
                                    color: "#198754",
                                    fontSize: "13px"
                                }}
                            >
                                ✓ {proofImage.name}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    style={{
                        marginTop: "25px",
                        padding: "13px 25px",
                        border: "none",
                        borderRadius: "9px",
                        backgroundColor: "#198754",
                        color: "#ffffff",
                        fontSize: "15px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Create Donation
                </button>
            </form>
        </div>
    );
}

export default CreateDonation;
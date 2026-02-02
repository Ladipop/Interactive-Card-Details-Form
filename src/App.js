import logo from "./images/card-logo.svg";
import complete from "./images/icon-complete.svg";
import "./App.css";
import { useState } from "react";

function App() {
  const [isComplete, setIsComplete] = useState(false);
  const [card, setCard] = useState({
    name: "",
    number: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  });
  function handleContinue() {
    setIsComplete(false);
    setCard({
      name: "",
      number: "",
      expMonth: "",
      expYear: "",
      cvc: "",
    });
    setError({});
  }

  const [error, setError] = useState({});
  const newError = {};
  return (
    <main className="container">
      <section className="left-panel">
        <LeftPanel card={card} />
      </section>
      <RightPanel
        card={card}
        setCard={setCard}
        error={error}
        setError={setError}
        isComplete={isComplete}
        setIsComplete={setIsComplete}
        newError={newError}
        handleContinue={handleContinue}
      />
    </main>
  );
}
function RightPanel({
  card,
  setCard,
  error,
  newError,
  setError,
  isComplete,
  setIsComplete,
  handleContinue,
}) {
  return (
    <section className="right-panel">
      {isComplete ? (
        <Confirmation onContinue={handleContinue} />
      ) : (
        <Form
          card={card}
          setCard={setCard}
          error={error}
          setError={setError}
          newError={newError}
          isComplete={isComplete}
          setIsComplete={setIsComplete}
        />
      )}
    </section>
  );
}

function LeftPanel({ card }) {
  return (
    <div className="cards">
      <CardFront card={card} />
      <CardBack card={card} />
    </div>
  );
}

function CardFront({ card }) {
  return (
    <div className="card-front">
      <aside className="card-logo">
        <img src={logo} alt="logo" className="logo" />
      </aside>

      <p className="card-number">{card.number || "0000 0000 0000 0000"}</p>

      <div className="name-expiry">
        <p className="name">{(card.name || "JANE APPLESEED").toUpperCase()}</p>

        <p className="card-expiry">
          {card.expMonth || "00"}/{card.expYear || "00"}
        </p>
      </div>
    </div>
  );
}

function CardBack({ card }) {
  return (
    <div className="card-back">
      <p className="back-cvc">{card.cvc || "000"}</p>
    </div>
  );
}

function Confirmation({ onContinue }) {
  return (
    <aside className="success">
      <img src={complete} alt="check" />
      <p className="thank-you">Thank you!</p>
      <p>We've added your card details</p>
      <button onClick={onContinue}>Continue</button>
    </aside>
  );
}
function Form({
  card,
  setCard,
  error,
  setError,
  newError,
  isComplete,
  setIsComplete,
}) {
  function handleSubmit(e) {
    e.preventDefault();

    // Handle Error
    const month = Number(card.expMonth);
    const year = Number(card.expYear);
    const currentYY = new Date().getFullYear() % 100;
    const currentMM = new Date().getMonth() + 1;
    const rawCardNum = card.number.replace(/ /g, "");

    if (!card.name) {
      newError.name = "Can't be blank";
    }

    if (!card.number) {
      newError.number = "Can't be blank";
    } else if (isNaN(rawCardNum)) {
      newError.number = "Wrong format, numbers only";
    } else if (rawCardNum.length < 16) {
      newError.number = "Card number should be 16 digits";
    }

    if (!card.expMonth) {
      newError.expMonth = "Can't be blank";
    } else if (isNaN(card.expMonth.trim())) {
      newError.expMonth = "Wrong format";
    } else if (month < 1 || month > 12) {
      newError.expMonth = "Invalid month";
    }

    if (!card.expYear) {
      newError.expYear = "Can't be blank";
    } else if (isNaN(card.expYear.trim())) {
      newError.expYear = "Wrong format";
    } else if (year < currentYY) {
      newError.expYear = "Card expired";
    }

    if (!newError.expMonth && !newError.expYear) {
      if (year === currentYY && month < currentMM) {
        newError.expMonth = "Card expired";
      }
    }
    if (!card.cvc) {
      newError.cvc = "Can't be blank";
    } else if (isNaN(card.cvc.trim())) {
      newError.cvc = "Numbers only";
    }
    setError(newError);
    if (Object.keys(newError).length === 0) {
      setIsComplete(true);
    }
  }
  return (
    <form className="user-input" onSubmit={handleSubmit}>
      {/* CardHolder Name */}
      <div className="cardholder-name">
        <label className="card-name-lbl lbl" htmlFor="name">
          Cardholder Name
        </label>
        <input
          type="text"
          id="name"
          maxLength={25}
          className={error.name ? "card-name input error" : "input card-name"}
          name="name"
          placeholder="e.g. Jane Appleseed"
          value={card["name"]}
          onChange={(e) => {
            setCard((prev) => ({
              ...prev,
              name: e.target.value,
            }));
            setError((prev) => ({
              ...prev,
              name: "",
            }));
          }}
        />
        {error.name && <p className="error">{error.name}</p>}
      </div>

      {/* Card Number */}
      <div className="cardholder-number">
        <label className="card-num-lbl lbl" htmlFor="num">
          Card Number
        </label>
        <input
          id="num"
          type="text"
          inputMode="numeric"
          maxLength={19}
          className={error.number ? "card-num input error" : "input card-num"}
          name="num"
          placeholder="e.g. 1234 5678 9123 000"
          value={card["number"]}
          onChange={(e) => {
            const digitsOnly = e.target.value.replace(/\D/g, "");
            const formatted = digitsOnly.replace(/(.{4})/g, "$1 ").trim();
            setCard((prev) => ({
              ...prev,
              number: formatted,
            }));
            setError((prev) => ({
              ...prev,
              number: "",
            }));
          }}
        />
        {error.number && <p className="error">{error.number}</p>}
      </div>
      {/* Expiry Date (MM/YY) */}
      <div className="exp-cvc">
        <div className="exp-date-orig">
          <label className="exp-date-lbl lbl" htmlFor="exp-month">
            Exp.Date (mm/yy)
          </label>
          <aside className="exp-date">
            <input
              id="exp-month"
              type="text"
              inputMode="numeric"
              maxLength={2}
              className={
                error.expMonth ? "exp-month input error" : "input exp-month"
              }
              name="exp-month"
              placeholder="MM"
              value={card["expMonth"]}
              aria-label="Expiration month"
              onChange={(e) => {
                setCard((prev) => ({
                  ...prev,
                  expMonth: e.target.value,
                }));
                setError((prev) => ({
                  ...prev,
                  expMonth: "",
                }));
              }}
            />
            <input
              id="exp-year"
              type="text"
              inputMode="numeric"
              maxLength={2}
              className={
                error.expYear ? "exp-year input error" : "input exp-year"
              }
              name="exp-year"
              placeholder="DD"
              value={card["expYear"]}
              aria-label="Expiration year"
              onChange={(e) => {
                setCard((prev) => ({
                  ...prev,
                  expYear: e.target.value,
                }));
                setError((prev) => ({
                  ...prev,
                  expYear: "",
                }));
              }}
            />
          </aside>
          <div className="month-err-year-err">
            {error.expMonth && <p className="error">{error.expMonth}</p>}
            {error.expYear && <p className="error">{error.expYear}</p>}
          </div>
        </div>
        {/* CVC */}
        <aside className="cvc-orig">
          <label className="cvc-lbl lbl" htmlFor="cvc">
            cvc
          </label>
          <input
            id="cvc"
            type="text"
            inputMode="numeric"
            maxLength={3}
            className={error.cvc ? "cvc-input input error" : "input cvc-input"}
            name="cvc"
            placeholder="e.g. 123"
            value={card["cvc"]}
            onChange={(e) => {
              setCard((prev) => ({
                ...prev,
                cvc: e.target.value,
              }));
              setError((prev) => ({
                ...prev,
                cvc: "",
              }));
            }}
          />
          {error.cvc && <p className="error">{error.cvc}</p>}
        </aside>
      </div>
      <button className="btn" type="submit">
        Confirm
      </button>
    </form>
  );
}

export default App;

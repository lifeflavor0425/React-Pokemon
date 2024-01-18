import { useEffect, useState } from "react";
import Type from "./Type";

const DamageRelations = ({ damages }) => {
  const [damagePokemonForm, setDamagePokemonForm] = useState();

  useEffect(() => {
    const arrayDamage = damages.map((damage) =>
      separateObjectBetweenToAndFrom(damage)
    );
    if (arrayDamage.length === 2) {
      // 합치는 부분
      const obj = joinDamageRelations(arrayDamage);
      setDamagePokemonForm(reduceDuplicateValues(postDamageValue(obj.from)));
    } else {
      setDamagePokemonForm(postDamageValue(arrayDamage[0].from));
    }
  }, []);
  const joinDamageRelations = (props) => {
    return {
      from: joinObject(props, "from"),
      to: joinObject(props, "to"),
    };
  };
  const reduceDuplicateValues = (props) => {
    const duplicateValues = {
      double_damage: "4x",
      half_damage: "1/4x",
      no_damage: "0x",
    };

    return Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName;
      const verifiedValue = filterForUniqueValues(value, duplicateValues[key]);
      return (acc = { [keyName]: verifiedValue, ...acc });
    }, {});
  };

  const filterForUniqueValues = (valueForFiltering, damageValue) => {
    return valueForFiltering.reduce((acc, currentValue) => {
      const { url, name } = currentValue;
      const filterACC = acc.filter((a) => a.name !== name);

      return filterACC.length === acc.length
        ? (acc = [currentValue, ...acc])
        : (acc = [{ damageValue: damageValue, name, url }, ...filterACC]);
    }, []);
  };

  const joinObject = (props, string) => {
    const key = string;
    const firstArrayValue = props[0][key];
    const secondArrayValue = props[1][key];
    const result = Object.entries(secondArrayValue).reduce(
      (acc, [keyName, value]) => {
        const concatData = firstArrayValue[keyName].concat(value);
        return (acc = { [keyName]: concatData, ...acc });
      },
      {}
    );
    return result;
  };
  const postDamageValue = (props) => {
    const result = Object.entries(props).reduce((acc, [keyName, value]) => {
      const valueOfKeyName = {
        double_damage: "2x",
        half_damage: "1/2x",
        no_damage: "0x",
      };
      const key = keyName;
      return (acc = {
        [keyName]: value.map((i) => ({
          damageValue: valueOfKeyName[key],
          ...i,
        })),
        ...acc,
      });
    }, {});
    return result;
  };
  const separateObjectBetweenToAndFrom = (damage) => {
    const from = filterDamageRelations("_from", damage);
    const to = filterDamageRelations("_to", damage);
    return { from, to };
  };
  const filterDamageRelations = (valueFilter, damage) => {
    const result = Object.entries(damage)
      .filter(([keyName, value]) => keyName.includes(valueFilter))
      .reduce((acc, [keyName, value]) => {
        const keyWithValueFilterRemove = keyName.replace(valueFilter, "");
        return (acc = {
          [keyWithValueFilterRemove]: value,
          ...acc,
        });
      }, {});

    return result;
  };
  return (
    <div className="flex gap-2 flex-col">
      {damagePokemonForm ? (
        <>
          {Object.entries(damagePokemonForm).map(([keyName, value]) => {
            const key = keyName;
            const valuesOfkeyName = {
              double_damage: "Week",
              half_damage: "Resgistant",
              no_damage: "Immuune",
            };
            return (
              <div key={key}>
                <h3 className="capitalize font-medium text-sm md:text-base text-slate-500 text-center">
                  {valuesOfkeyName[key]}
                </h3>
                <div className="flex flex-wrap gap-1 justify-center">
                  {value.length > 0 ? (
                    value.map(({ name, url, damageValue }) => (
                      <Type type={name} key={url} damageValue={damageValue} />
                    ))
                  ) : (
                    <Type type={"none"} key={"none"} />
                  )}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default DamageRelations;

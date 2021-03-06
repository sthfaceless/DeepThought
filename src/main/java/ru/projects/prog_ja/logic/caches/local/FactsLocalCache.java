package ru.projects.prog_ja.logic.caches.local;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import ru.projects.prog_ja.dto.commons.CommonFactTransfer;
import ru.projects.prog_ja.dto.smalls.SmallTagTransfer;
import ru.projects.prog_ja.logic.caches.interfaces.FactsCache;
import ru.projects.prog_ja.model.dao.FactsDAO;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;


@Service
@Scope( scopeName = "singleton")
public class FactsLocalCache implements FactsCache {

    /**
     * Лист для хранения всех фактов
     * */
    private static Map<Long, CommonFactTransfer> facts = new ConcurrentHashMap<>();

    /**
     * Карта для хранения индексов по id тега
     * */
    private static Map<Long, List<Long>> indexes = new ConcurrentHashMap<>();

    private final FactsDAO factsDAO;

    public FactsLocalCache(@Autowired FactsDAO factsDAO){
        this.factsDAO = factsDAO;
    }

    /**
     * При иницициализации кеша получаем все факты,
     * для каждого факта проводим индексацию по его тегам,
     * затем ложим сам факт в кеш
     *
     * Так как будет происходить обновление кеша, то создаём сначала временные карты,
     * и только после их заполнения присваиваем ссылку на них статическим переменным
     * */

    @PostConstruct
    public void init(){

        Map<Long, CommonFactTransfer> factsTemp = new ConcurrentHashMap<>();
        Map<Long, List<Long>> indexesTemp = new ConcurrentHashMap<>();

        List<CommonFactTransfer> factsTempList = factsDAO.getAllFacts();
        if(factsTempList == null){
            return;
        }

        factsTempList.forEach((fact) -> {

                    /*
                    * Получаем теги факта и итерируемся по ним
                    * */
                    Set<SmallTagTransfer> tags = fact.getTags();
                    for(SmallTagTransfer tag : tags){
                        /*
                        * Если тег уже есть в индексах, то добавляем туда факт
                        * */
                        if(indexesTemp.containsKey(tag.getId())){
                            indexesTemp.get(tag.getId()).add(fact.getId());
                        }
                        else{
                            /*
                            * Если тега еще нет, то по данному id ложим новый List,
                             * который уже имеет 1 инициализированное значением
                            * */
                            indexesTemp.put(tag.getId(), new ArrayList<Long>(){{
                                add(fact.getId());
                            }});
                        }
                    }

                    factsTemp.put(fact.getId(), fact);
                });

            facts = factsTemp;
            indexes = indexesTemp;
    }

    /**
    * Обновляем кеш каждые 1000mc * 60 * 60 (час),
    * */
    @Scheduled(fixedRate = 3_600_000)
    public void update(){

        init();

    }

    /**
     * Метод без защиты от конкурентного доступа, отдаёт рандомный факт пользователю
    * */
    @Override
    public CommonFactTransfer getFact(long id){

        return facts.get(id);
    }


    /**
    * Защищаем метод от конкурентного доступа,
     * после проверяем, что факты по этому тегу существуют и позиция не больше длины листа,
     * если всё правильно, то возвращаем факт из общей карты
    * */

    @Override
    public CommonFactTransfer getFactByTag(long tagID, int positionInList){

        List<Long> tagsList = indexes.get(tagID);
        if(tagsList == null || tagsList.size() < positionInList){

            return null;
        }

        return facts.get(tagsList.get(positionInList));
    }

    /**
     * Возвращает текущий размер кеша с фактами
     * */
    @Override
    public int cacheSize(){

        return facts.size();
    }

    /**
     * получаем длину листа по данному тегу
     *
     * */

    @Override
    public int factsByTagSize(long tagID){

        return indexes.getOrDefault(tagID, Collections.emptyList()).size();
    }


    /**
    * Обеспечиваем конкурентный доступ к добавлению фактов в кеш
    * */

    @Override
    public void putFact(CommonFactTransfer fact){

            facts.put(fact.getId(), fact);

    }

    @Override
    public void deleteFactFromCache(long factId){

            facts.remove(factId);

    }
}
